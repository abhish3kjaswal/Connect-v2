const express = require('express');

const router = express.Router();

const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const User = require('../../models/User');

const config = require('config');

const secret = config.get('jwtSecret');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

//#route Get api/auth
//#access public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//#route Post api/login
// Login user
//#access public
router.post(
  '/login',
  [
    check('email', 'Enter a Valid Email Id').isEmail().normalizeEmail(),
    check('password', 'password is not valid').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User does not exists' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'password does not match' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//update password
//route post api/auth/login
// register user
//#access public
router.post(
  '/forgetpassword',
  [
    [
      check('email', 'enter your').isEmail().normalizeEmail(),
      check(
        'newPassword',
        'enter a New password with minimum 6 or maximum 10 characters'
      ).isLength({
        min: 6,
        max: 10,
      }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, newPassword } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Wrong credentials' }] });
      }
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();
      res.json({ msg: 'success' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

const express = require('express');

const router = express.Router();

const { check, validationResult } = require('express-validator/check');

const bcrypt = require('bcryptjs');

const gravatar = require('gravatar');

const config = require('config');

const jwt = require('jsonwebtoken');

const secret = config.get('jwtSecret');

const User = require('../../models/User');

//#route Get api/users
// register user
//#access public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Valid Email is required').isEmail().normalizeEmail(),
    check(
      'password',
      'enter a valid password with minimum 6 or maximum 10 characters'
    ).isLength({
      min: 6,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'email already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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

module.exports = router;

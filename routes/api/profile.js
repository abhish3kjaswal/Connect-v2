const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');

const config = require('config');

const githubClientId = config.get('githubClientId');

const githubSecret = config.get('githubSecret');

const User = require('../../models/User');

const Profile = require('../../models/Profile');

const Post = require('../../models/Post');

const request = require('request');
const { response } = require('express');

//#route Get api/profile/me
// get current users profile
//#access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'profile does not exist' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//#route Post api/profile/changepassword/me
// update users password
//#access Private
router.post(
  '/changepassword/',
  [
    auth,
    [
      check('email', 'Valid Email is required').isEmail().normalizeEmail(),
      check(
        'newPassword',
        'enter a valid password with minimum 6 or maximum 10 characters'
      ).isLength({
        min: 6,
        max: 10,
      }),
      check('oldPassword', 'enter your current password ').isLength({
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
    const { email, newPassword, oldPassword } = req.body;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      let user = await User.findOne({ email });
      if (!profile && !user) {
        //update
        return res.status(400).json({ errors: [{ msg: 'Wrong credentials' }] });
      }

      const ispassword = await bcrypt.compare(oldPassword, user.password);
      if (!ispassword) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'please enter correct password' }] });
      }
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(newPassword, salt);
      res.json(profile);

      await user.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//#route Post api/profile/me
//  create or update users profile
//#access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').not().isEmpty(),
      check('skills', 'skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //create profile if there is no profile

      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route GET api/profile
//get all profile
//public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route GET api/profile/user/user_id
//get  profile by user id
//Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route Delete api/profile
//get  delete profile
//private
router.delete('/', auth, async (req, res) => {
  try {
    //Remove user posts
    await Post.deleteMany({ user: req.user.id });
    //Remove user profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route Put api/profile/experience
//get  add profile experience
//private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),

      check('company', 'company is required').not().isEmpty(),

      check('from', ' from date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      description,
      current,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route Delete api/profile/experience/:exp_id
//get  delete profile experience
//private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route Put api/profile/education
//get  add profile experience
//private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),

      check('degree', 'degree is required').not().isEmpty(),

      check('from', ' from date is required').not().isEmpty(),

      check('fieldofstudy', ' field of study date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      description,
      current,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route Delete api/profile/education/:edu_id
//get  delete profile education
//private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route get api/profile/gihutb/:username
//get  get github profile
//public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}$client_secret=${githubSecret}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, reponse, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: 'github profile not found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;

const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const User = require('../../models/User');
// @router  POST     api/users
// @desc    Register new user
// @access  Public

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists.' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      console.log(user);

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      console.log(user);
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hashSync(password, salt);

      await user.save();
      console.log(user);
      // Return jsonwebtoken

      res.send('User registered.');
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
      return;
    }
  }
);

// @router  GET     api/users
// @desc    Test    route
// @access  Public

router.get('/', (req, res) => res.send('Users route.'));

module.exports = router;

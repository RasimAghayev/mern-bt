const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @router  GET     api/auth
// @desc    Test    route
// @access  Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select('-password');
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

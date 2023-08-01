const express = require('express');
const { check, validationResult } = require('express-validator');

// Middleware
const auth = require('../../middleware/auth');

// Models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { config } = require('process');

// Router
const router = express.Router();

// @router  POST    api/posts
// @desc    Create a post
// @access  Public

router.post('/', 
[
  auth,
  check('text', 'Text is required.').not().isEmpty(),
],
async (req, res) => {
    const errors=validationResult(req)
    if(!errors){
        return res.status(400).json({ errors: errors.array()})
    }

    const user=await User.findById(req.user.id).select(-passwrod)
    try {

        const newPost=new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        
        const post= await newPost.save()

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.')
    }
});

module.exports = router;

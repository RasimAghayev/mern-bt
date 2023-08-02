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



// @router  GET    api/posts
// @desc    Get all posts
// @access  Private

router.get('/', 
auth,
async (req, res) => {
    try {
        const posts = await Post.find().sort({date:-1})
        res.json(psots)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.')
    }
});


// @router  GET    api/posts/:id
// @desc    Get a post
// @access  Private

router.get('/:id', 
auth,
async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).sort({date:-1})

        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }

        res.json(psot)
    } catch (err) {
        console.error(err.message);

        if(err.kind==='ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        res.status(500).send('Server error.')
    }
});

// @router  DEELETE    api/posts/:id
// @desc    Delte a post
// @access  Private

router.delete('/:id', 
auth,
async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized.'})
        }
        await post.remove()
        res.json({msg: 'Post removed.'})
        
    } catch (err) {
        console.error(err.message);

        if(err.kind==='ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        res.status(500).send('Server error.')
    }
});



module.exports = router;

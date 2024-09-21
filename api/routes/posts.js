const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();


//create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json({message : "New Post is created"})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//update post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json({message : "Post updated successfully :)"})
        }
        else{ 
            res.status(403).json({message : "You can only update your post"})
        }
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//delete post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json({message : "Post deleted successfully :)"})
        }
        else{ 
            res.status(403).json({message : "You can only delete your post"})
        }
        
    } catch (error) {
        res.status(500).json(error.message)
    }
})
//like / dislike post

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push : {likes : req.body.userId}})
            res.status(201).json({message : "The post has been liked successfully"})
        }
        else{
            await post.updateOne({$pull : {likes : req.body.userId}})
            res.status(201).json({message : "The post been unliked successfully "})
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
})


//get a post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({message : error.message })
    }
})

//get timeline post
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId : currentUser._id});
        const friendPosts = await Promise.all(
            (currentUser.followings || []).map((friendId) => {
                return Post.find({userId : friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

//get user's all post
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({username:req.params.username})
        const posts = await Post.find({ userId : user._id })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

module.exports = router;
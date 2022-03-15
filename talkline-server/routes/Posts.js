const express = require('express')
const router = express.Router()
const postModel = require('../models/posts')
const User = require('../models/users')

//create a post

router.post('/',async(req,res)=>{
const newPost = new postModel(req.body)
try{
    const savedPost = await newPost.save();
    res.status(201).json(savedPost)
}catch(err){
    res.status(500).send(err)
}

})

//update a post 
router.put('/:id',async(req,res)=>{
   try{ 

    const post = await postModel.findById(req.params.id)
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body})
        res.status(200).json({message:"post updated",post})
    }else{
        res.status(403).send("you can only update your post")
    }
   }catch(err){
       res.status(500).send(err)
   }
})

//delete a post

router.delete('/:id',async(req,res)=>{
    const post = await postModel.findById(req.params.id)
    try{
         if(post.userId === req.body.userId){
             await post.deleteOne();
             res.status(200).send("post deleted")
         }else{
            res.status(403).send("you can only delete your post")
         }
    }catch(err){
        res.status(500).send(err)
    }
})

// get a post

router.get('/:id',async(req,res)=>{
    try{
        const getPost = await postModel.findById(req.params.id)
        res.status(200).json(getPost)
    }catch(err){
        res.status(500).send(err)
    }

})

// like or dislike a post
router.put('/:id/like',async(req,res)=>{
    try{
        const post = await  postModel.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
           await post.updateOne({$push:{likes:req.body.userId}})
           res.status(200).send("post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
          res.status(200).send("post has been disliked")
        }
    }catch(err){
        res.status(500).send(err)
    }
})

//get timeline posts
router.get('/timeline/all',async(req,res)=>{
       
    try{
         const currentUser = await User.findById(req.body.userId)
         const userPosts = await postModel.find({userId:currentUser._id})
         const friendPosts = await Promise.all(
             currentUser.following.map((friendId)=>{
                 return postModel.find({userId:friendId})
             })
         );
         res.json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err)
    }
})

// get all posts of a user
router.get("/profile/:username",async(req,res)=>{
    try{
        const user = await User.find({username:req.params.username}) 
        const userPosts = await postModel.find({userId:user._id})
        res.status(200).json(userPosts)
    }catch(err){
        res.status(500).send(err)
    }

})

module.exports=router
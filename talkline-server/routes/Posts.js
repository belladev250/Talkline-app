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







module.exports=router
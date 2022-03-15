const express = require('express')
const router = express.Router()
const userModel = require('../models/users')
const bcrypt = require('bcrypt')

//update a user 
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await userModel.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json({message:"Account has been updated",user});
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  });


//delete a user 
router.delete('/:id',async(req,res)=>{
//check if the id is the same as the logged user
if(req.body.userId === req.params.id || req.body.isAdmin){
   try{
    await userModel.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"Account has been deleted"})

   }catch(err){
     return res.status(400).send(err)
   }

}else{
   return  res.status(403).json({message:"you can only delete your account"})
}

})

//get a user 

router.get('/:id',async(req,res)=>{
      const userId = req.body.userId
       const username = req.body.username
    try{
       
  const user = userId ? await userModel.findById(userId): await  userModel.findOne({username:username})
    const {updatedAt,password,...other} =user._doc
       res.status(200).json(other)
    }catch(err){
       return res.status(403).send(err)
    }
})
//follow a user 
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
           //get current user and user you want to follow
           const user = await userModel.findById(req.params.id)
           const currentUser = await userModel.findById(req.body.userId)
           if(!user.followers.includes(req.body.userId)){
               await user.updateOne({$push:{followers:req.body.userId}})
               await currentUser.updateOne({$push:{following:req.params.id}})
               res.status(200).send("user followed")
           }else{
               res.status(403).send("you already followed this user")
           }
        }catch(err){
            return res.status(500).send(err)
        }

    }else{
       return res.status(403).send("you can't follow your self")
    }
})

//unfollow a user
router.put("/:id/unfollow",async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
           //get current user and user you want to follow
           const user = await userModel.findById(req.params.id)
           const currentUser = await userModel.findById(req.body.userId)
           if(user.followers.includes(req.body.userId)){
               await user.updateOne({$pull:{followers:req.body.userId}})
               await currentUser.updateOne({$pull:{following:req.params.id}})
               res.status(200).send("user unfollowed")
           }else{
               res.status(403).send("you don't follow this user")
           }
        }catch(err){
            return res.status(500).send(err)
        }

    }else{
       return res.status(403).send("you can't unfollow your self")
    }
})

// get friends of a user

router.get("/friends/:userId",async(req,res)=>{
try{
    const user = await userModel.findById(req.params.userId)
    const friends = await Promise.all(
      user.following.map((friendId)=>{
        return userModel.findById(friendId)
      })
    )
    let friendsList =[];
    friends.map((friend)=>{
      const{_id,username,profilePicture }= friend;
      friendsList.push({_id,username,profilePicture})
    })
     res.status(200).send(friendsList)
}catch(err){
    res.status(500).send(err)
}  

})

module.exports =router
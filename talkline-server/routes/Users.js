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
        res.status(200).json("Account has been updated");
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
if(req.body.userId === req.params.id || req.body.id){
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
    try{
       const user = await userModel.findById(req.params.id)
    const {createdAt,updatedAt,password,...other} =user._doc
       res.status(200).json(other)
    }catch(err){
       return res.status(403).send(err)
    }
})
//follow a user 

//unfollow a user


module.exports =router
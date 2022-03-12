const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router();
const User = require('../models/users')

router.post("/register",async(req,res)=>{
 
    User.findOne({email:req.body.email},function(err,user){
        if(user)
        res.status(400).json({message:"user already exists"})
    })
    

  try{

    //hash a new password
    const salt =await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    
    //create a user
    const newUser = new User({
        username : req.body.username,
        email:req.body.email,
        password: hashedPassword

    })
    //save user 
    const user = await newUser.save()
    res.status(201).json({message:"user registered successfully",user})

}catch(err){
    res.status(400).json({message:"failed to register user",err})
}
})

// Login a user 
router.post("/login",async(req,res)=>{

    try{
    const user  = await User.findOne({email:req.body.email})
    !user && res.status(404).json({message:"user not found"})

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    !validPassword && res.status(400).json({message :" wrong password"})

    res.status(200).json({message:"user logged in ",user})

} catch(err){

    res.status(400).json({message:"failed to login",err})
}

})

module.exports = router


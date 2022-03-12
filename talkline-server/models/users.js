const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

username:{
  type:String,
  unique:true,
  require:true,
  min:3,
  max:20

},

email:{
    type:String,
    unique:true,
    require:true,
    max:50
},
password:{
    unique:true,
    type:String,
    min:6
},

profilePicture:{
    type:String,
    default:""
},
coverPicture:{
    type:String,
    default:""
},
 followers:{
   type:Array,
   default:[]
 },

 following:{
     type:Array,
     default:[]
 },

 isAdmin:{
     type:Boolean,
     default:false
 },
  
 desc:{
     type:String,
     max:50
 },

 city:{
     type:String,
     max:50
 },
 from:{
     type:String,
     max:50
 },

 relationship:{
     type:Number,
     enum:[1,2,3]
 },

},
 { timestamps:true}

)

module.exports = mongoose.model("users",userSchema)
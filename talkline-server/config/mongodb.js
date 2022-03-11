const mongoose = require('mongoose')
mongoose.pluralize()
mongoose.connect(
    "mongodb://localhost:27017/Talkline-db",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
   
    }
).then(()=>console.log("connected to the database successfully"))
.catch((err)=>console.log("failed to connect to the database"))

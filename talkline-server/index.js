const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/Users')
const postRouter = require('./routes/Posts')
require('./config/mongodb')
require('./models/users')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(helmet())
app.use(morgan("common"))

app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api/posts",postRouter)


const port = 5000
app.listen(port,()=>console.log("talkline is running on ",+port));


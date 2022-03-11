const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
require('./config/mongodb')
require('./models/users')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(helmet())
app.use(morgan("common"))

const port = 5000
app.listen(port,()=>console.log("talkline is running on ",+port));


const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require("../models/user.model");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Have Node serve the files for our built React app
app.use(express.json());
app.use(cors());

//~~~~~~~~~~~~~~~~~~~~~ CONNECTION TO DATABASE ~~~~~~~~~~~~~~~~~~~~~~~
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//app.use('/recipes', recipesRouter);
//const recipesRouter = require('../routes/recipes.js');

//SOLELY FOR DEBUG, CAN COMMENT OUT/REMOVE FOR FINAL PRODUCT
app.use('/users', usersRouter);
const usersRouter = require('../routes/users.js');
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get("/",cors(),(req,res)=>{

})


app.post("/",async(req,res)=>{
    const{username,password}=req.body
    console.log("logging in")

    try{
        const check=await User.findOne({username:username, password:password})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
        }

    }
    catch(e){
        res.json("fail")
    }

})



app.post("/signup",async(req,res)=>{
    const {username,password} = req.body
    console.log("signing up")

    const data={
        username:username,
        password:password
    }

    try{
        const check = await User.findOne({username:username})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            await User.insertMany([data])
        }

    }
    catch(e){
        res.json("fail")
    }

})

app.listen(PORT,()=>{
   console.log("port connected");
})

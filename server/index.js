const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Have Node serve the files for our built React app
app.use(express.json());

//~~~~~~~~~~~~~~~~~~~~~ CONNECTION TO DATABASE ~~~~~~~~~~~~~~~~~~~~~~~
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//const usersRouter = require('../routes/users.js');
//const recipesRouter = require('../routes/recipes.js');

//app.use('/users', usersRouter);
//app.use('/recipes', recipesRouter);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get("/",cors(),(req,res)=>{

})


app.post("/",async(req,res)=>{
    const{username,password}=req.body

    try{
        const check=await collection.findOne({username:username})

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
    const{username,password}=req.body

    const data={
        username:username,
        password:password
    }

    try{
        const check = await collection.findOne({username:username})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            await collection.insertMany([data])
        }

    }
    catch(e){
        res.json("fail")
    }

})

app.listen(PORT,()=>{
   console.log("port connected");
})

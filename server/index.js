const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require("../models/user.model");
const Recipe = require("../models/recipe.model");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Have Node serve the files for our built React app
app.use(express.json());
app.use(cors({
    origin: '*'
}));

//~~~~~~~~~~~~~~~~~~~~~ CONNECTION TO DATABASE ~~~~~~~~~~~~~~~~~~~~~~~
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// SOLELY FOR DEBUG, CAN COMMENT OUT/REMOVE FOR FINAL PRODUCT
const usersRouter = require('../routes/users.js');
app.use('/users', usersRouter);

const recipesRouter = require('../routes/recipes.js');
app.use('/recipes', recipesRouter);
// END OF DEBUG PORTION ====================================

app.get("/", cors(), (req, res) => {

})

// START OF LOGIN & SIGNUP BACKEND ===========================================

app.post("/", async(req, res) => {
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

app.post("/signup", async(req, res) => {
    const {username, password} = req.body
    console.log("signing up")

    const data = {
        username:username,
        password:password
    }

    try{
        const check = await User.findOne({username:username})

        if (check) {
            res.json("exist")
        } else {
            await User.insertMany([data])
            res.json("notexist")
        }

    } catch(e) {
        res.json("fail")
    }

})

// END OF LOGIN & SIGNUP BACKEND =============================================

// START OF C.R.U.D. BACKEND =================================================

app.get("/recipes", async(req, res) => {
    Recipe.find({}, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    })
})

app.post("/create", async(req, res) => {
    const {title, description, ingredients} = req.body

    const data = {
        title: title,
        description: description,
        ingredients: ingredients
    }

    try {
        const check = await Recipe.findOne(data)
        if (check) {
            res.json("recipeexist")
        } else {
            Recipe.insertMany([data])
            res.json("recipenotexist")
        }
    } catch (e) {
        res.json("recipefail")
    }
})

// END OF C.R.U.D. BACKEND ===================================================

app.listen(PORT, () => {
   console.log("port connected");
})

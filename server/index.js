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
    const {username, password, confirmPassword} = req.body
    console.log("signing up")

    const data = {
        username:username,
        password:password,
        confirmPassword:confirmPassword
    }

    try{

        const check = await User.findOne({username:username})
        
        if (check) {
            res.json("exist")
        } else if (data.password != data.confirmPassword) {
            res.json("mismatch")
        } else {
            res.json("notexist")
            await User.insertMany([data])
            res.json("notexist")
        }

    } catch(e) {
        res.json("fail")
    }

})

// END OF LOGIN & SIGNUP BACKEND =============================================

// START OF C.R.U.D. BACKEND =================================================

//Retrieve list of all recipes
app.get("/recipes", async (req, res) => {
    try {
        const result = await Recipe.find({});
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

//Retrieve list of recipes with title matching search keywords
app.post("/search", async(req, res) => {
    const keyword = req.body.searchInput
    try {
        const result = await Recipe.find({ title:{ $regex: keyword }});
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

//HARDCODED, might want to replace in future with general filtering capabilities
//Retrieve list of recipes created by a certain user
app.post("/myRecipes", async(req, res) => {
    const username = req.body.username
    try {
        const result = await Recipe.find({ creator: username });
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

//HARDCODED, might want to replace in future with general filtering capabilities
//Retrieve list of recipes created by a certain user filtered by search
app.post("/searchMyRecipes", async(req, res) => {
    const username = req.body.username
    const keyword = req.body.searchInput
    try {
        const result = await Recipe.find({ creator: username, title:{ $regex: keyword }});
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

//Creates new recipe with given inputs
app.post("/create", async(req, res) => {
    const {title, description, ingredients, instructions, creator} = req.body

    const data = {
        title: title,
        description: description,
        ingredients: ingredients,
        instructions: instructions,
        creator: creator,
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

//Retrieves unique recipe using input ID
app.post("/recipe", async(req, res) => {
    const { id } = req.body
    const user = await Recipe.findById(id)
    .catch(e => {
        console.log(e)
    })
    res.json(user)
})

// END OF C.R.U.D. BACKEND ===================================================

app.listen(PORT, () => {
   console.log(`port ${PORT} connected`);
})

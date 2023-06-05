import React from "react"
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from "axios"


function Edit (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState("")

    const { recipeId } = useParams()
    const [ recipe, setRecipe ] = useState("")
    
    const history = useNavigate();

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

    useEffect(() => {
        try {
            axios.post("https://baby-chef.herokuapp.com/recipe", { recipeId })
            .then(res => {
                setRecipe(res.data)
            })
            .catch(e => {
                alert("Error!")
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    })
    
    const [title, setTitle] = useState(recipe.title)
    const [description, setDescription] = useState(recipe.description)
    const [ingredients, setIngredients] = useState(recipe.ingredients)
    const [instructions, setInstructions] = useState(recipe.instructions)
   

    const updateRecipe = () => {
        axios.post('https://baby-chef.herokuapp.com/edit', {
            id: recipeId,
            title: title,
            description: description,
            ingredients: ingredients,
            instructions: instructions,
            creator: username
        })
        .then(res => {
            if (res.data == "updateSuccess") {
                alert("Recipe successfully updated")
                history("/home", {state: {userId: userId}})
            } else {
                alert("Error!")
            }
        });
    };

    return (
        <div className="edit">
            <label>Title</label>
            <br></br>
            <input 
                type="text"
                defaultValue = {recipe.title} 
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
            />
            <br></br>
            <label>Description</label>
            <br></br>
            <textarea 
                defaultValue = {recipe.description} 
                onChange={(event) => {
                    setDescription(event.target.value)
                }}
            />
            <br></br>
            <label>Ingredients</label>
            <br></br>
            <textarea 
                defaultValue = {recipe.ingredients} 
                onChange={(event) => {
                    setIngredients(event.target.value)
                }}
            />
            <br></br>
            <label>Instructions</label>
            <br></br>
            <textarea 
                defaultValue = {recipe.instructions} 
                onChange={(event) => {
                    setInstructions(event.target.value)
                }}
            />
            <br></br>
            <button onClick={updateRecipe}>Update Recipe!</button>
        </div>
    )
}

export default Edit
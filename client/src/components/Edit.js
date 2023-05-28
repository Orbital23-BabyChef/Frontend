import React from "react"
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from "axios"


function Edit (){
    const location = useLocation()
    const username = location.state.currUser
    const { id } = useParams()
    const [ recipe, setRecipe ] = useState("")
    
    const history = useNavigate();

    useEffect(() => {
        try {
            axios.post("http://localhost:3001/recipe", { id })
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
        axios.post('http://localhost:3001/edit', {
            id: id,
            title: title,
            description: description,
            ingredients: ingredients,
            instructions: instructions,
            creator: username
        })
        .then(res => {
            if (res.data == "updateSuccess") {
                alert("Recipe successfully updated")
                history("/home", {state: {id: username}})
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
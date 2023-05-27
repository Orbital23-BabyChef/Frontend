import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import axios from "axios"


function Create (){
    const location = useLocation()
    const username = location.state.id

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [ingredients, setIngredients] = useState("")
    
    const history = useNavigate();

    const addToList = () => {
        axios.post('http://localhost:3001/create', {
            title: title,
            description: description,
            ingredients: ingredients,
            creator: username
        })
        .then(res => {
            if (res.data == "recipeexist") {
                alert("Recipe already exists!")
            } else if (res.data == "recipenotexist") {
                alert("Recipe added!")
                history("/home", {state: {id: username}})
            } else {
                alert("Error!")
            }
        });
    };

    return (
        <div className="homepage">
            <label>Title</label>
            <br></br>
            <input type="text" 
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
            />
            <br></br>
            <label>Description</label>
            <br></br>
            <textarea 
                onChange={(event) => {
                    setDescription(event.target.value)
                }}
            />
            <br></br>
            <label>Ingredients</label>
            <br></br>
            <textarea 
                onChange={(event) => {
                    setIngredients(event.target.value)
                }}
            />
            <br></br>
            <button onClick={addToList}>Create Recipe!</button>
        </div>
    )
}

export default Create
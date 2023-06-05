import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"


function Create (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [instructions, setInstructions] = useState("")
    
    const history = useNavigate();

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

    const addToList = () => {
        axios.post('https://baby-chef.herokuapp.com/create', {
            title: title,
            description: description,
            ingredients: ingredients,
            instructions: instructions,
            creator: username
        })
        .then(res => {
            if (res.data == "recipeexist") {
                alert("Recipe already exists!")
            } else if (res.data == "recipenotexist") {
                alert("Recipe added!")
                history("/home", {state: {userId: userId, username: username}})
            } else {
                alert("Error!")
            }
        });
    };

    return (
        <div className="create">
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
            <label>Instructions</label>
            <br></br>
            <textarea 
                onChange={(event) => {
                    setInstructions(event.target.value)
                }}
            />
            <br></br>
            <button onClick={addToList}>Create Recipe!</button>
        </div>
    )
}

export default Create
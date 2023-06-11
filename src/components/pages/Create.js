import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Create (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [ingredients, setIngredients] = useState("")
    
    const history = useNavigate();

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

    const addToList = () => {
        if (title.length < 3) {
            toast.error("TITLE cannot be less than 3 characters long", toastStyling)
        } else if (description.length < 3) {
            toast.error("DESCRIPTION cannot be less than 3 characters long", toastStyling)
        } else if (ingredients.length < 3) {
            toast.error("INGREDIENTS cannot be less than 3 characters long", toastStyling)
        } else {
            axios.post('https://baby-chef.herokuapp.com/checkRecipe', {
                title: title,
                description: description,
                ingredients: ingredients,
                creator: userId,
            })
            .then(res => {
                if (res.data == "recipeexist") {
                    toast.error("Recipe already exists!", toastStyling)
                } else if (res.data == "recipefail") {
                    toast.error("Unknown error, try again later", toastStyling)
                } else {
                    history("/steps/create", {state: {
                        userId: userId, 
                        title: title,
                        description: description,
                        ingredients: ingredients,
                        username: username,
                        steps:[]
                    }})
                }
            });
        }
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
            <button onClick={addToList}>Next Step</button>
            <ToastContainer />
        </div>
    )
}

export default Create
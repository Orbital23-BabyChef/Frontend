import React from "react"
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Edit (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)

    const recipeId = useParams().id
    
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
    
    const [title, setTitle] = useState(location.state.title)
    const [description, setDescription] = useState(location.state.description)
    const [ingredients, setIngredients] = useState(location.state.ingredients)
   

    const updateRecipe = () => {
        axios.post('https://baby-chef.herokuapp.com/edit', {
            id: recipeId,
            title: title,
            description: description,
            ingredients: ingredients,
            creator: userId
        })
        .then(res => {
            if (res.data == "updateSuccess") {
                sessionStorage.setItem("itemStatus", "edited")
                history("/home", {state: {userId: userId, username: username}})
            } else {
                toast.error("Unknown error, try again later", toastStyling)
            }
        })
        .catch(err => {
            toast.error("Unknown error, try again later", toastStyling)
            console.log(err)
        });
    };

    return (
        <div className="edit">
            <label>Title</label>
            <br></br>
            <input 
                type="text"
                defaultValue = {title} 
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
            />
            <br></br>
            <label>Description</label>
            <br></br>
            <textarea 
                defaultValue = {description} 
                onChange={(event) => {
                    setDescription(event.target.value)
                }}
            />
            <br></br>
            <label>Ingredients</label>
            <br></br>
            <textarea 
                defaultValue = {ingredients} 
                onChange={(event) => {
                    setIngredients(event.target.value)
                }}
            />
            <br></br>
            <button onClick={updateRecipe}>Update Recipe!</button>
            <ToastContainer />
        </div>
    )
}

export default Edit
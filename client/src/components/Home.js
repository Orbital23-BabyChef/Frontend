import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {  useEffect, useState } from 'react';
import Axios from "axios"

function Home (){
    const location=useLocation()

    const [recipeList, setRecipeList] = useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/recipes").then( response => {
            setRecipeList(response.data);
        })
    })

    return (
        <div className="homepage">
            <h1>Hello {location.state.id}!</h1>
            <Link to="/create">Create a new Recipe</Link>
            {recipeList.map((value, key) => {
                return <div> 
                    <hr></hr>
                    <h3>Title: {value.title}</h3>
                    <p>Description: {value.description} <br></br>
                    Ingredients: {value.ingredients} </p> 
                </div>
            })}
        </div>
    )
}

export default Home
import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"

function Home (){
    const location = useLocation()
    const username = location.state.id

    const [recipeList, setRecipeList] = useState([])

    useEffect(() => {
        axios.get("http://localhost:3001/recipes").then( response => {
            setRecipeList(response.data);
        })
    })

    return (
        <div className="homepage">
            <h1>Hello {username}!</h1>
            <Link to="/create" state={{id: username}}>Create a new Recipe</Link>
            {recipeList.map((value, key) => {
                return <div> 
                    <hr></hr>
                    <h3>{value.title}</h3>
                    <p>{value.description} </p>
                    <p>Creator: {value.creator}</p> 
                </div>
            })}
        </div>
    )
}

export default Home
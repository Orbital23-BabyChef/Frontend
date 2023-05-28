import React from "react"
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"


function View (){
    const location = useLocation()
    const currUser = location.state.currUser

    const { id } = useParams()
    const [ recipe, setRecipe ] = useState("")

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

    return (
        <div className="view">
            {recipe ? (
                <>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                    <p>{recipe.ingredients}</p>
                    <p>{recipe.instructions}</p>
                    <p>Creator: {recipe.creator}</p>
                    {recipe.creator == currUser ? ( 
                        <Link to={`/edit/${id}`} state={{ id: id, currUser: currUser }}>
                            Edit
                        </Link>
                        // Can add Linkto delete button under here
                    ) : null}
                </>
            ) : null}
        </div>
      );

}

export default View
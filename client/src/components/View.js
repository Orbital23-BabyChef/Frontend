import React from "react"
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"


function View (){
    const { id } = useParams()
    const [ user, setUser ] = useState("")

    useEffect(() => {
        try {
            axios.post("http://localhost:3001/recipe", { id })
            .then(res => {
                setUser(res.data)
            })
            .catch(e => {
                alert("Error!")
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    })

    if (user) {
        return (
            <div className="view">
                    <h3>{user.title}</h3>
                    <p>{user.description} </p>
                    <p>{user.ingredients} </p>
                    <p>{user.instructions} </p>
                    <p>Creator: {user.creator}</p> 
            </div>
        )
    } else {
        return (
            <div className="view">
            </div>
        )
    }

}

export default View
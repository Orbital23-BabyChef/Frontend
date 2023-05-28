import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"

function Home (){
    const location = useLocation()
    const username = location.state.id

    const [recipeList, setRecipeList] = useState([])
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };
      
    useEffect(() => {
        if (searchInput.length == 0) {
            axios.get("http://localhost:3001/recipes").then( res => {
                setRecipeList(res.data);
            })
        } else {
            axios.post("http://localhost:3001/search", { searchInput })
            .then(response => {
                setRecipeList(response.data);
            })
        }
    })

    return (
        <div className="homepage">
            <h1>Hello {username}!</h1>
            <Link to="/profile" state={{currUser: username}}>My profile</Link>
            <p></p>
            <br />
            <Link to="/create" state={{id: username}}>Create a new Recipe</Link>
            <p></p>
            <br />
            <input
                type="text"
                placeholder="Search here"
                onChange={handleChange}
                value={searchInput} />
            {recipeList.map((value, key) => {
                return <div key={value._id}> 
                    <hr></hr>
                    <Link to={`/view/${value._id}`} state={{currUser: username}}>{value.title}</Link>
                    <p>{value.description} </p>
                    <p>Creator: {value.creator}</p> 
                </div>
            })}
        </div>
    )
}

export default Home
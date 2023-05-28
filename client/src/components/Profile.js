import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"


function Profile (){
    const location = useLocation()
    const username = location.state.currUser

    const [recipeList, setRecipeList] = useState([])
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };
      
    useEffect(() => {
        if (searchInput.length == 0) {
            axios.post("http://localhost:3001/myRecipes", { username })
            .then(response => {
                setRecipeList(response.data);
            })
        } else {
            axios.post("http://localhost:3001/searchMyRecipes", { username, searchInput })
            .then(response => {
                setRecipeList(response.data);
            })
        }
    })

    return (
        <div className="profile">
            <h1>{username}'s Profile</h1>
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
                    <hr></hr>
                    <Link to={`/edit/${value._id}`} state={{currUser: username}}>edit this recipe</Link>
                    <p>{value.description} </p>
                    <p>Creator: {value.creator}</p> 
                </div>
            })}
        </div>
    )

}

export default Profile
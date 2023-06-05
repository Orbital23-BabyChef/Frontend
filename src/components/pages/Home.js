import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
import '../RecipePreview.css'

function Home (){
    const location = useLocation()
    const [username, setUsername] = useState("")

    const [recipeList, setRecipeList] = useState([])
    const [searchInput, setSearchInput] = useState("")

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };
      
    useEffect(() => {
        if (searchInput.length == 0) {
            axios.get("https://baby-chef.herokuapp.com/recipes").then( res => {
                setRecipeList(res.data);
            })
        } else {
            axios.post("https://baby-chef.herokuapp.com/search", { searchInput })
            .then(response => {
                setRecipeList(response.data);
            })
        }
    })

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef.herokuapp.com/username/?id=${location.state.currId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })
    return (
        <div className="homepage">
            <h1>Hello {username}!</h1>
            <Link to="/profile" state={{currUser: username}}>My profile</Link>
            <br></br>
            <br></br>
            <Link to="/create" state={{id: username}}>Create a new Recipe</Link>
            <br></br>
            <br></br>
            <input
                type="text"
                placeholder="Search here"
                onChange={handleChange}
                value={searchInput} />
                {recipeList.map((value, key) => {
                    return <div 
                        key={value._id}>
                        <div 
                            className="recipePreview">
                            <br></br>
                                <div
                                    className="recipeTitle">
                                    <Link to={`/view/${value._id}`} state={{currUser: username}}>{value.title}</Link> 
                                </div>
                                <p className="fifty-chars">{value.description} </p>
                                <p>Creator: {value.creator}</p>
                        </div>
                    </div>
                })}
        </div>
    )
}

export default Home
import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"

function Home (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState("")

    const [recipeList, setRecipeList] = useState([])
    const [searchInput, setSearchInput] = useState("")

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };
      
    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

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


    return (
        <div className="homepage">
            <h1>Hello {username}!</h1>
            <Link to="/profile" state={{userId: userId}}>My profile</Link>
            <br></br>
            <br></br>
            <Link to="/create" state={{userId: userId}}>Create a new Recipe</Link>
            <br></br>
            <br></br>
            <input
                type="text"
                placeholder="Search here"
                onChange={handleChange}
                value={searchInput} />
                {recipeList.map((value, key) => {
                    return <div key={value._id}> 
                        <hr></hr>
                        <Link to={`/view/${value._id}`} state={{userId: userId}}>{value.title}</Link>
                        <p>{value.description} </p>
                        <p>Creator: {value.creator}</p> 
                    </div>
                })}
        </div>
    )
}

export default Home
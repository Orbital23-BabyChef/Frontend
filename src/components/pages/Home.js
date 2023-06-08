import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
import '../RecipePreview.css'
import { Button } from "@mui/material"
import profilepic from '../ProfilePicPlaceholder.png'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

function Home (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)

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
            <div className="searchBar">
            <input
                type="text"
                placeholder="Search here"
                onChange={handleChange}
                value={searchInput} />

            <Button component={Link} to="/profile" state={{userId: userId, username: username}}>
                    <img src={profilepic} style={{ width: 50, height: 50, marginLeft:10 }}   />
            </Button>

            <IconButton component={Link} to="/create" state={{userId: userId, username: username}}>
                    <AddIcon style={{ width: 50, height: 50}}   />
            </IconButton>
            </div>
            
            {recipeList.map((value, key) => {
                return  <div key={value._id}>
                        <div 
                            className="recipePreview">
                            <br></br>
                            <div
                                className="recipeTitle">
                                <Link to={`/view/${value._id}`} state={{userId: userId, username: username}}>{value.title}</Link>
                            </div>
                            <p className="fifty-chars">{value.description} </p>
                            <p> Creator: {value.creator} </p>
                        </div>
                        </div>
            })}
        </div>
    )
}

export default Home
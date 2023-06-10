import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../RecipePreview.css'
import { Button } from "@mui/material"
import profilepic from '../ProfilePicPlaceholder.png'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';


function Profile (){
    const location = useLocation()
    const [username, setUsername] = useState(location.state.username)
    const userId = location.state.userId
    
    const history = useNavigate()

    const [recipeList, setRecipeList] = useState([])
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };
    
    const submit = (recipeId) => {
        confirmAlert({
            title: 'Delete Confirmation',
            message: 'Are you sure you would like to delete this recipe? This action is irreversible.',
            buttons: [
              {
                label: 'OK',
                onClick: () => {
                    try {
                        axios.post("https://baby-chef.herokuapp.com/delete/", { recipeId })
                        .then(res => {
                            if (res.data == "deleteSuccess") {
                                alert("Record successfully deleted.")
                                history("/home", {state:{userId: userId, username: username}})
                            } else {
                                alert("Error!")
                            }
                        })
                        .catch(e => {
                            alert("Error!")
                            console.log(e)
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
              },
              {
                label: 'Cancel',
              }
            ]
        });
    }

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

    useEffect(() => {
        axios.post("https://baby-chef.herokuapp.com/searchMyRecipes", { userId, searchInput })
        .then(response => {
            setRecipeList(response.data);
        })
    })

    return (
        <div className="profile">
            <h1>{username}'s Profile</h1>
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
                return <div key={value._id}>
                    <div 
                        className="recipePreview">
                        <br></br>
                        <div
                            className="recipeTitle">
                            <Link to={`/view/${value._id}`} state={{userId: userId, username: username}}>{value.title}</Link>
                        </div>
                        <p className="fifty-chars">{value.description} </p>
                        <p> Creator: {username} </p>
                        <Link to={`/edit/${value._id}`} state={{
                            userId: userId, 
                            username: username,
                            title: value.title,
                            description: value.description,
                            ingredients: value.ingredients,
                            instructions: value.instructions
                        }}>Edit</Link>
                        <br></br>
                        <button onClick={() => submit(value._id)}>Delete</button>
                    </div>
                </div>
            })}
        </div>
    )

}

export default Profile
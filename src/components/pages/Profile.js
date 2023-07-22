import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../RecipePreview.css'

import { styled } from '@mui/material/styles';
import { Button } from "@mui/material"
import profilepic from '../ProfilePicPlaceholder.png'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Profile (){
    const location = useLocation()
    const [username, setUsername] = useState(location.state.username)
    const userId = location.state.userId
    const [likedRecipes, setLikedRecipes] = useState({})
    
    const history = useNavigate()

    const [recipeList, setRecipeList] = useState([])
    const [searchInput, setSearchInput] = useState("");

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    const StyledThumbUpIcon = styled(ThumbUpIcon)(({ theme }) => ({
        cursor: 'pointer',
    }));

    const StyledThumbUpOutlinedIcon = styled(ThumbUpOutlinedIcon)(({ theme }) => ({
        cursor: 'pointer',
    }));

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
                        axios.post("https://baby-chef-backend-031f48e42090.herokuapp.com/delete/", { recipeId })
                        .then(res => {
                            if (res.data == "deleteSuccess") {
                                sessionStorage.setItem("itemStatus", "deleted")
                                history("/home", {state:{userId: userId, username: username}})
                            } else {
                                toast.error("Unknown error, try again later", toastStyling)
                            }
                        })
                        .catch(e => {
                            toast.error("Unknown error, try again later", toastStyling)
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

    const likeRecipe = (recipeId) => {
        axios.post(`https://baby-chef-backend-031f48e42090.herokuapp.com/like`, {userId, recipeId})
        .then(res => {
            setLikedRecipes(prevLikedPosts => ({
                ...prevLikedPosts,
                [recipeId]: true,
            }));
            setRecipeList(prevRecipeList => prevRecipeList.map(recipe => {
                if (recipe._id === recipeId) {
                  return { ...recipe, likeCount: recipe.likeCount + 1 };
                }
                return recipe;
            }));
        })
    }

    const unlikeRecipe = (recipeId) => {
        axios.post(`https://baby-chef-backend-031f48e42090.herokuapp.com/unlike`, {userId, recipeId})
        .then(res => {
            setLikedRecipes(prevLikedPosts => ({
                ...prevLikedPosts,
                [recipeId]: false,
            }));
            setRecipeList(prevRecipeList => prevRecipeList.map(recipe => {
                if (recipe._id === recipeId) {
                  return { ...recipe, likeCount: recipe.likeCount - 1 };
                }
                return recipe;
            }));
        })
    }

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef-backend-031f48e42090.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
            setLikedRecipes(res.data.likedPosts);
        })
    })

    //Runs only on first render to retrieve entire list of recipes by this user
    useEffect(() => {
        axios.post("https://baby-chef-backend-031f48e42090.herokuapp.com/searchMyRecipes", { userId })
        .then(response => {
            setRecipeList(response.data);
        })
        .catch(res => {
            setRecipeList([])
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
            {recipeList
                .filter(recipe => recipe.title.toLowerCase().includes(searchInput))
                .map((value, key) => {
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
                            <p> Likes: {value.likeCount} </p>
                            { likedRecipes != undefined && !likedRecipes[value._id]
                                ? <StyledThumbUpOutlinedIcon onClick={() => likeRecipe(value._id)}></StyledThumbUpOutlinedIcon>
                                : <StyledThumbUpIcon onClick={() => unlikeRecipe(value._id)}></StyledThumbUpIcon>
                            }  
                            <br></br>
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
            <ToastContainer />
        </div>
    )

}

export default Profile
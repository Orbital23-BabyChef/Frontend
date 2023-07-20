import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
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

function Home (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)
    const [likedRecipes, setLikedRecipes] = useState({})

    const [recipeList, setRecipeList] = useState([])
    const [searchInput, setSearchInput] = useState("")

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    const StyledThumbUpIcon = styled(ThumbUpIcon)(({ theme }) => ({
        cursor: 'pointer',
    }));

    const StyledThumbUpOutlinedIcon = styled(ThumbUpOutlinedIcon)(({ theme }) => ({
        cursor: 'pointer',
    }));

    const likeRecipe = (recipeId) => {
        axios.post(`https://baby-chef-backend-031f48e42090.herokuapp.com/like`, {userId, recipeId})
        .then(res => {
            setLikedRecipes(prevLikedPosts => ({
                ...prevLikedPosts,
                [recipeId]: true,
            }));
        })
    }

    const unlikeRecipe = (recipeId) => {
        axios.post(`https://baby-chef-backend-031f48e42090.herokuapp.com/unlike`, {userId, recipeId})
        .then(res => {
            setLikedRecipes(prevLikedPosts => ({
                ...prevLikedPosts,
                [recipeId]: true,
            }));
        })
    }

    useEffect(() => {
        const itemStatus = sessionStorage.getItem("itemStatus")
        if (itemStatus == "deleted") {
            toast.info("Recipe successfully deleted!", toastStyling)
        } else if (itemStatus == "added") {
            toast.success("Recipe successfully added!", toastStyling)
        } else if (itemStatus == "edited") {
            toast.success("Recipe successfully edited!", toastStyling)
        }
        sessionStorage.removeItem("itemStatus")
    })

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef-backend-031f48e42090.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
            setLikedRecipes(res.data.likedPosts);
        })
    })

    //Runs only on first render to retrieve entire list of recipes
    useEffect(() => {
        axios.get("https://baby-chef-backend-031f48e42090.herokuapp.com/fullRecipeList")
        .then(response => {
            setRecipeList(response.data);
        })
        .catch(res => {
            setRecipeList([])
        })
    }, [])


    return (
        <div className="homepage">
            <div className="searchBar">
                <input
                    type="text"
                    placeholder="Search for your next recipe"
                    onChange={handleChange}
                    value={searchInput} 
                />
                <Button component={Link} to="/profile" state={{userId: userId, username: username}}>
                        <img src={profilepic} style={{ width: 50, height: 50, marginLeft:10 }}   />
                </Button>

                <IconButton component={Link} to="/create" state={{userId: userId, username: username}}>
                        <AddIcon style={{ width: 50, height: 50}}   />
                </IconButton>
            </div>
            
            {/* Takes recipe list and filters it according to current search input, is not case sensitive*/}
            {recipeList
                .filter(recipe => recipe.title.toLowerCase().includes(searchInput))
                .map((value, key) => {
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
                                    <p> Likes: {value.likeCount} </p>
                                    { !likedRecipes[value._id]
                                        ? <StyledThumbUpOutlinedIcon onClick={() => likeRecipe(value._id)}></StyledThumbUpOutlinedIcon>
                                        : <StyledThumbUpIcon onClick={() => unlikeRecipe(value._id)}></StyledThumbUpIcon>
                                    }   
                                </div>
                            </div>
                })}
            <ToastContainer />
        </div>
    )
}

export default Home
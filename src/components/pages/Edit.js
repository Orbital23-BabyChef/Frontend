import React from "react"
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Create.css'
import { Button, createTheme, ThemeProvider } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const theme = createTheme({
    palette: {
      primary: {
        main: '#00a143',
      },
      secondary: {
        main: '#eb3828',
      },
    },
})

function Edit (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)
    const [likedRecipes, setLikedRecipes] = useState(location.state.likedRecipes)
    const [title, setTitle] = useState(location.state.title)
    const [description, setDescription] = useState(location.state.description)
    const [ingredients, setIngredients] = useState(location.state.ingredients)
    const steps = location.state.steps
    const recipeId = useParams().id
    
    const history = useNavigate();

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef-backend-031f48e42090.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

    const updateRecipe = () => {
        if (title.length < 3) {
            toast.error("TITLE cannot be less than 3 characters long", toastStyling)
        } else if (description.length < 3) {
            toast.error("DESCRIPTION cannot be less than 3 characters long", toastStyling)
        } else if (ingredients.length < 3) {
            toast.error("INGREDIENTS cannot be less than 3 characters long", toastStyling)
        } else {
            history(`/steps/${recipeId}`, {state: {
                userId: userId, 
                title: title,
                description: description,
                ingredients: ingredients,
                username: username,
                steps: steps
            }})
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <div className="create">
            <Link 
                to={`/view/${recipeId}`} 
                state={{
                    username: username,
                    userId: userId,
                    likedRecipes: likedRecipes
                }}
            ><ArrowBackIcon className='backArrow'/></Link>
            <div className="createTitle">
            <label>Name of Dish</label>
            <br></br>
            <input type="text" 
                defaultValue = {title}
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
            />
            </div>
            <br></br>
            <div>
            <label>Description</label>
            <br></br>
            <textarea 
                defaultValue={description}
                onChange={(event) => {
                    setDescription(event.target.value)
                }}
            />
            </div>
            <br></br>
            <div>
            <label>Ingredients</label>
            <br></br>
            <textarea 
                defaultValue={ingredients}
                onChange={(event) => {
                    setIngredients(event.target.value)
                }}
            />
            </div>
            <Button 
                variant="outlined"
                color="primary"
                sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                onClick={updateRecipe}>Edit Steps</Button>
            <ToastContainer />
        </div>
        </ThemeProvider>
    )
}

export default Edit
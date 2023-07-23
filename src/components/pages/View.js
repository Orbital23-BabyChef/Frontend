import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { React, useEffect, useState } from 'react'
import { Button, createTheme, ThemeProvider } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios"
import './View.css'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { styled } from '@mui/material/styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function View (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)
    const [likedRecipes, setLikedRecipes] = useState(location.state.likedRecipes)

    const history = useNavigate()
    
    const recipeId = useParams().id
    const [ recipe, setRecipe ] = useState("")

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

    const submit = () => {
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
                                history("/home", {state:{userId, username, likedRecipes}})
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
            setRecipe(prevRecipe => ({
                likeCount: prevRecipe.likeCount + 1,
                ...prevRecipe
            }))
        })
    }

    const unlikeRecipe = (recipeId) => {
        axios.post(`https://baby-chef-backend-031f48e42090.herokuapp.com/unlike`, {userId, recipeId})
        .then(res => {
            setLikedRecipes(prevLikedPosts => ({
                ...prevLikedPosts,
                [recipeId]: false,
            }));
            setRecipe(prevRecipe => ({
                likeCount: prevRecipe.likeCount - 1,
                ...prevRecipe
            }))
        })
    }

    useEffect(() => {
        axios.get(`https://baby-chef-backend-031f48e42090.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    }, [])

    useEffect(() => {
        try {
            axios.post("https://baby-chef-backend-031f48e42090.herokuapp.com/recipe", {id: recipeId})
            .then(res => {
                setRecipe(res.data)
            })
            .catch(e => {
                toast.error("Unknown error, try again later", toastStyling)
                console.log(e)
            });
        } catch (e) {
            toast.error("Unknown error, try again later", toastStyling)
            console.log(e)
        }
    }, [recipeId])

    console.log(recipe.image)

    return (
        <ThemeProvider theme={theme}>
        <div className="view">
            {recipe ? (
                <>
                    <Link 
                        to={`/home`} 
                        state={{
                            username: username,
                            userId: userId,
                        }}
                    ><ArrowBackIcon className='backArrow'/></Link>
                    
                    <div className='title'>
                        <h3>{recipe.title}</h3>
                    </div>
                    <div className='imagebox'>
                        {recipe.image && <img className="image" src={recipe.image}/>}
                    </div>
                    <div className='description'>
                        <p>{recipe.description}</p>
                    </div>
                    <div className='ingredients'>
                        <p>{recipe.ingredients}</p>
                    </div>
                    
                    <p>{recipe.instructions}</p>
                    <hr />
                    <p>Instruction Preview:</p>
                    {recipe.steps.map((value, key) => {
                        return <div key={recipe.steps.indexOf(value)}> 
                            {value.stepType == "Duration" 
                            ? <div>
                                <h4>Step {key+1} (Duration)</h4>
                                <p>{value.stepDescription}</p>
                                <p>Duration (in secs): {value.stepDuration}</p>
                                <p>Concurrent Steps: {Array.isArray(value.stepConcurrentSteps) 
                                        ? value.stepConcurrentSteps.reduce((h, acc) => h + ", " + acc)
                                        : undefined
                                    }</p>
                                <p>Ending Steps: {value.stepAfterSteps}</p>
                              </div>
                            : <div>
                                <h4>Step {key+1} (Static)</h4>
                                <p>{value.stepDescription}</p>
                            </div>}
                        </div>
                    })}
                    <hr />
                    <p>Creator: {recipe.creator}</p>
                    <p>Likes: {recipe.likeCount} </p>
                    { likedRecipes != undefined && !likedRecipes[recipe._id]
                        ? <StyledThumbUpOutlinedIcon onClick={() => likeRecipe(recipe._id)}></StyledThumbUpOutlinedIcon>
                        : <StyledThumbUpIcon onClick={() => unlikeRecipe(recipe._id)}></StyledThumbUpIcon>
                    }  
                    <br></br>
                    <Button component={Link} to={`/stepview/${recipeId}/0`} 
                        state={{
                            username: username,
                            userId: userId,
                            recipe: recipe
                        }}
                        variant="contained"
                        color="primary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                    >Start Cooking Now!</Button>

                    <br></br>
                    { recipe.creator ==  username ? ( 
                        <>
                            <Button component={Link} to={`/edit/${recipeId}`}
                                    state={{
                                        userId: userId,
                                        username: username,
                                        title: recipe.title,
                                        description: recipe.description,
                                        ingredients: recipe.ingredients,
                                        instructions: recipe.instructions,
                                        steps: recipe.steps
                                    }}>
                                Edit
                            </Button>
                            <Button 
                                onClick={submit}
                                color='secondary'
                                >Delete</Button>
                        </>
                    ) : null}
                    
                    
                </>
            ) : null}
            <ToastContainer />
        </div>
        </ThemeProvider>
      );

}

export default View
import React from "react";
import { useLocation, useNavigate, useParams, Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import { useTimer } from 'react-timer-hook';
import { iconButton, Button, createTheme, ThemeProvider } from "@mui/material";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { styled } from '@mui/material/styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Steps.css'
import './StepView.css'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

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

//function created for timer functionality
function MyTimer({ expiryTimestamp, timeInSecs, endingStep }) {
    const [ showPopUp, setShowPopUp ] = useState(false)
    const [ isComplete, setIsComplete ] = useState(false)

    const iconSize = 50

    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({ expiryTimestamp, onExpire: () => setShowPopUp(true)});
  
    return (<div>
        {!isComplete 
            ? <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '100px'}}>
                <span>{minutes}</span>:<span>{seconds.toString().padStart(2,"0")}</span>
                </div>
                { isRunning
                    ? <PauseIcon style={{ width:iconSize, height:iconSize }} onClick={pause}></PauseIcon>
                    : <PlayArrowIcon style={{ width:iconSize, height:iconSize }} onClick={resume}></PlayArrowIcon>
                }  
                <RestartAltIcon style={{ width:iconSize, height:iconSize }} onClick={() => {
                const time = new Date();
                time.setSeconds(time.getSeconds() + timeInSecs);
                restart(time)
                }}>Restart</RestartAltIcon>
                <Popup open={showPopUp} onClose={() => setShowPopUp(false)}>
                    <div>{endingStep}</div>
                    <button onClick={() => {
                        setShowPopUp(false);
                        setIsComplete(true);
                    }}>OK</button>
                </Popup>
            </div>
            : <p>☑ {endingStep}</p>
        }
    </div>);
  }

function StepView() {
    const history = useNavigate()
    const location = useLocation()

    const recipeId = useParams().id
    const stepNum = +(useParams().stepnum)
    const userId = location.state.userId

    const [ username, setUsername ] = useState(location.state.username)
    const [ recipe, setRecipe ] = useState(location.state.recipe)
    const [ likedRecipes, setLikedRecipes ] = useState({})
     
    //step to be shown for the given recipeID and stepnum
    const currStep = recipe.steps[stepNum]

    // this variable stores the state of the step viewing process
    const [ currProcess, setCurrProcess ] = useState( currStep ? currStep.stepType
                                                               : "end")
    // Static => showing the description from a static page
    // Duration => showing the timed description from a duration page
    // timing => showing timer with other relevant information
    // end => showing end screen of the recipe interactive UI
    
    const time = new Date();
    time.setSeconds(time.getSeconds() + (currStep 
                                         ? +currStep.stepDuration
                                         : 0))

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

    // converts time stored in seconds to string format:
    // MM minutes and SS Seconds
    const secsToMMSS = (timeInSecs) => {
        const minsPart = Math.floor(timeInSecs/60)
        const secsPart = timeInSecs % 60
        return `${minsPart} MIN ${secsPart} SEC`
    }

    const nextPage = () => {
        setCurrProcess(stepNum + 1 < recipe.steps.length
            ? recipe.steps[stepNum + 1].stepType
            : "end");
    };

    const prevPage = () => {
        setCurrProcess(recipe.steps[stepNum - 1].stepType);
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
            setLikedRecipes(res.data.likedPosts);
        })
    })

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
    })

    return (
        <ThemeProvider theme={theme}>
        <div className="stepView">
        { currProcess != "end"
            ? <h3 className="stepViewNumber">Step {stepNum + 1}</h3>
            : <h3 className="stepViewNumber">END OF RECIPE</h3>
        }
        { currProcess == "Static"
            ? <div className="staticStepDetails">{currStep.stepDescription}</div>
            : currProcess == "Duration"
            ? <>
                <div className="staticStepDetails">
                    {currStep.stepDescription} <br/> FOR {secsToMMSS(currStep.stepDuration)}</div>
                <Button 
                    state={{
                        username: username,
                        userId: userId,
                        recipe: recipe
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => {setCurrProcess("timing")}}
                    className="stepButtons"
                >Start Timer</Button>
            </>
            : currProcess == "timing"
            ? <div className="durationStepDetails"> 
                <MyTimer 
                    expiryTimestamp={time} 
                    timeInSecs={+currStep.stepDuration} 
                    endingStep={currStep.stepAfterStep} 
                />
                <p className="durationConcurrentSteps">{currStep.stepConcurrentSteps}</p>
            </div>
            : <div> 
                <p className="endingStepDetails">That's the end of the recipe :)<br></br>
                Please leave a like if you enjoyed it!</p>
                { likedRecipes != undefined && !likedRecipes[recipe._id]
                    ? <StyledThumbUpOutlinedIcon onClick={() => likeRecipe(recipe._id)}></StyledThumbUpOutlinedIcon>
                    : <StyledThumbUpIcon onClick={() => unlikeRecipe(recipe._id)}></StyledThumbUpIcon>
                }  
            </div>
        }
        <div>
            { currProcess != "Duration" && currProcess != "end"
                ? <Button component={Link} to={`/stepview/${recipeId}/${stepNum + 1}`} 
                    state={{
                        username: username,
                        userId: userId,
                        recipe: recipe
                    }}
                    variant="contained"
                    color="primary"
                    onClick={nextPage}
                    className="stepButtons"
                >Continue</Button>
                :<></>
            }
            { currProcess == "end" 
                ? <Button component={Link} to={`/home`} 
                    state={{
                        username: username,
                        userId: userId,
                    }}
                    variant="contained"
                    color="primary"
                    className="stepButtons"
                >Back to Homepage</Button>
                :<></>
            }
            { stepNum > 0 
                ? 
                    <Button component={Link} to={`/stepview/${recipeId}/${stepNum - 1}`} 
                        state={{
                            username: username,
                            userId: userId,
                            recipe: recipe
                        }}
                        variant="contained"
                        color="primary"
                        onClick={prevPage}
                        className="stepButtons"
                    >Back to Prev Step</Button>
                :  
                    <Button component={Link} to={`/view/${recipeId}`} 
                        state={{
                            username: username,
                            userId: userId
                        }}
                        variant="contained"
                        color="primary"
                        className="stepButtons"
                    >Back to Recipe Page</Button>
            }
        </div> 
    </div>
    </ThemeProvider>)
}

export default StepView
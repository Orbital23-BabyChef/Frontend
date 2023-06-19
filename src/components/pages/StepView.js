import React from "react"
import { useLocation, useNavigate, useParams, Link} from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from "axios"
import { useTimer } from 'react-timer-hook';
import { Button, createTheme, ThemeProvider } from "@mui/material"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Steps.css'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

//function created for timer functionality
function MyTimer({ expiryTimestamp, timeInSecs, endingStep }) {
    const [ showPopUp, setShowPopUp ] = useState(false)
    const [ isComplete, setIsComplete ] = useState(false)

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
  
    return (<>
        {!isComplete 
            ? <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '30px'}}>
                <span>{minutes}</span>:<span>{seconds}</span>
                </div>
                <p>{isRunning ? 'Running' : 'Not running'}</p>
                <button onClick={pause}>Pause</button>
                <button onClick={resume}>Resume</button>
                <button onClick={() => {
                const time = new Date();
                time.setSeconds(time.getSeconds() + timeInSecs);
                restart(time)
                }}>Restart</button>
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
    </>);
  }

function StepView() {
    const history = useNavigate()
    const location = useLocation()

    const recipeId = useParams().id
    const stepNum = +(useParams().stepnum)
    const userId = location.state.userId

    const [ username, setUsername ] = useState(location.state.username)
    const [ recipe, setRecipe ] = useState(location.state.recipe)
     
    //step to be shown for the given recipeID and stepnum
    const currStep = recipe.steps[stepNum]

    // this variable stores the state of the step viewing process
    const [ currProcess, setCurrProcess ] = useState( currStep ? currStep.stepType
                                                               : "end")
    // Static => showing the description from a static page
    // Duration => showing the timed description from a duration page
    // Timing => showing timer with other relevant information
    
    const time = new Date();
    time.setSeconds(time.getSeconds() + (currStep 
                                         ? +currStep.stepDuration
                                         : 0))

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

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

    useEffect(() => {
        axios.get(`https://baby-chef.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

    useEffect(() => {
        try {
            axios.post("https://baby-chef.herokuapp.com/recipe", {id: recipeId})
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

    return (<div>
        <p>Step {stepNum + 1}</p>
        { currProcess == "Static"
            ? <>
                <p>{currStep.stepDescription}</p>
                <Link to={`/stepview/${recipeId}/${stepNum + 1}`} state={{ 
                    username: username, 
                    userId: userId, 
                    recipe: recipe 
                }}>
                    <Button onClick={nextPage}>Next Step</Button>
                </Link>
            </>
            : currProcess == "Duration"
            ? <>
                <p>{currStep.stepDescription} FOR {secsToMMSS(currStep.stepDuration)}</p>
                <Button onClick={() => {setCurrProcess("timing")}}>Start Timer</Button>
            </>
            : currProcess == "timing"
            ? <>
                <MyTimer expiryTimestamp={time} timeInSecs={+currStep.stepDuration} endingStep={currStep.stepAfterStep} />
                <p>{currStep.stepConcurrentSteps}</p>
                <Link to={`/stepview/${recipeId}/${stepNum + 1}`} state={{ 
                    username: username, 
                    userId: userId, 
                    recipe: recipe 
                }}>
                    <Button onClick={nextPage}>Next Step</Button>
                </Link>
            </>
            : <>
                <p>That's the end of the recipe, enjoy your dish!</p>
                <Link to={`/home`} state={{ username, userId }}>
                    Back to Home
                </Link>
            </>}
    </div>)
}

export default StepView
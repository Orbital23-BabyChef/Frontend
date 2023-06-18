import React from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, createTheme, ThemeProvider } from "@mui/material"
import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Steps.css'

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

function Steps() {
    const history = useNavigate()
    const location = useLocation()
    const [ currSteps, setCurrSteps ] = useState(location.state.steps)
    const userId = location.state.userId
    const username = location.state.username

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    //this variable stores the current state of the step creation process
    const [ currProcess, setCurrProcess ] = useState("default")
    //default => can either submit steps created or add a new step
    //static/duration => choosing between a static or duration step
    //staticCreating => user is in the process of creating a static step
    //durationCreating => user is in the process of creating a duration step
    //confirming => user is in the process of confirming all steps created

    //store values input in forms
    const [stepType, setStepType] = useState(undefined)
    const [stepDescription, setStepDescription] = useState(undefined)
    const [stepDuration, setStepDuration] = useState(undefined)
    const [stepConcurrentSteps, setStepConcurrentSteps] = useState(undefined)
    const [stepAfterStep, setStepAfterStep] = useState(undefined)

    const addStepToList = () => {
        const newStep = {
            stepType,
            stepDescription,
            stepDuration,
            stepConcurrentSteps,
            stepAfterStep
        }
        currSteps.push(newStep)
        returnToDefault()
    }

    const returnToDefault = () => {
        setCurrProcess("default")
        setStepType(undefined)
        setStepDescription(undefined)
        setStepDuration(undefined)
        setStepConcurrentSteps(undefined)
        setStepAfterStep(undefined)
    }

    
    
    const createRecipe = async() => {
        await axios.post("https://baby-chef.herokuapp.com/createRecipe", {
            title: location.state.title,
            description: location.state.description,
            ingredients: location.state.ingredients,
            creator: userId,
            steps: currSteps
        })
        .then(res => {
            if (res.data == "recipeexists") {//shouldn't really happen
                toast.error("Recipe already exists!", toastStyling)
            } else if (res.data == "recipefail") {
                toast.error("Unknown error, try again later", toastStyling)
            } else {
                sessionStorage.setItem("itemStatus", "added")
                history("/home", {state: {userId: userId, username: username}})
            }
        })
    }

    return (
        <ThemeProvider theme={theme}>
        <div className="steps">
            <div className="createdStepsList">
            {currSteps.map((value, key) => {
                return <div className="createdStep">
                            <div className="stepNumber">
                                Step {key + 1} ({value.stepType})
                            </div>
                            <div className="stepDescription">
                                <div>Description: {value.stepDescription}</div>
                                <div style={{marginTop: 10}}>{value.stepType == "Duration" ? "Duration: " + value.stepDuration + " seconds": ""}</div>
                                <div style={{marginTop: 10}}>{value.stepType == "Duration" ? "Concurrently: " + value.stepConcurrentSteps : ""}</div>
                                <div style={{marginTop: 10}}>{value.stepType == "Duration" ? "End of duration: " + value.stepAfterStep : ""}</div>
                            </div>
                        </div>
            })}
            </div>
            { currProcess == "default" 
                ? <Button 
                    onClick={() => {setCurrProcess("static/duration")}}
                    variant="outlined"
                    color="primary"
                    sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}>
                        + Add Step</Button>
                : currProcess == "static/duration"
                ? <div>
                    <Button 
                        onClick={() => {setCurrProcess("staticCreating"); setStepType("Static")}}
                        variant="outlined"
                        color="primary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                    >Static</Button>
                    <Button 
                        onClick={() => {setCurrProcess("durationCreating"); setStepType("Duration")}}
                        variant="outlined"
                        color="primary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                    >Duration</Button>
                    <Button 
                        onClick={() => {setCurrProcess("default")}}
                        variant="outlined"
                        color="primary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                    >Cancel</Button>
                  </div>
                : currProcess == "staticCreating"
                ? <div>
                    <input type="text" onChange={(e) => {setStepDescription(e.target.value)}} placeholder="Description" />
                    <Button 
                        onClick={addStepToList}
                        variant="outlined"
                        color="primary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                    >Create Step</Button>
                    <Button 
                        onClick={returnToDefault}
                        variant="outlined"
                        color="primary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                    >Cancel</Button>
                  </div>
                : currProcess == "durationCreating"
                ? <div>
                    <input type="text" onChange={(e) => {setStepDescription(e.target.value)}} placeholder="Description" />
                    <input type="text" onChange={(e) => {setStepDuration(e.target.value)}} placeholder="Duration in seconds" />
                    <input type="text" onChange={(e) => {setStepConcurrentSteps(e.target.value)}} placeholder="Concurrent Steps" />
                    <input type="text" onChange={(e) => {setStepAfterStep(e.target.value)}} placeholder="Ending step" />
                    <input type="submit" onClick={addStepToList} />
                  </div>
                : currProcess == "confirming"
                ? <Button 
                    onClick={createRecipe}
                    variant="outlined"
                    color="primary"
                    sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                  >Create Recipe!</Button>
                : <h1>Error!</h1>
            }
            <br />
            {currSteps.length >= 1 && currProcess == "default"
                ? <Button 
                    onClick={() => setCurrProcess("confirming")}
                    variant="outlined"
                    color="secondary"
                    sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                  >Confirm</Button>
                : <></>}
            <ToastContainer />
        </div>
        </ThemeProvider>
    )
}

export default Steps
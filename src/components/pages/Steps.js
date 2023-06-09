import React from "react"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, createTheme, ThemeProvider, IconButton } from "@mui/material"
import HelpIcon from '@mui/icons-material/Help';
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
    //Stores recipe ID, will be "create" if is new recipe
    const recipeId = useParams().id
    
    //true if current view is an edit page, false if it is a create page
    const isEdit = recipeId != "create"

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
    //editing => user is in the process of editting a step in the list

    //this variable stores the index of the step being edited
    const [ editingIndex, setEditingIndex ] = useState(undefined)
    //undefined => no element currently being edited

    //store values input in forms
    const [stepType, setStepType] = useState(undefined)
    const [stepDescription, setStepDescription] = useState(undefined)
    //Duration stored in a length 2 array of [<mins>, <secs>]
    const [stepDuration, setStepDuration] = useState([undefined, undefined])
    const [stepConcurrentSteps, setStepConcurrentSteps] = useState(undefined)
    const [stepAfterStep, setStepAfterStep] = useState(undefined) 

    const updateMin = (newMin) => {
        setStepDuration((prevState) => [newMin, prevState[1]]);
    }

    const updateSec = (newSec) => {
        setStepDuration((prevState) => [prevState[0], newSec]);
    }

    const minsIn = (secs) => Math.floor(secs/60)

    const addStepToList = () => {
        // formatting duration into seconds 
        const min = +stepDuration[0];
        const sec = +stepDuration[1];

        if (stepType == "Duration" && (isNaN(min) || isNaN(sec))) {
            toast.error("Duration fields must be a valid numerical value!", toastStyling);
            return;
        }
        
        const newDuration = min*60 + sec;

        const newStep = {
            stepType,
            stepDescription,
            stepDuration: newDuration,
            stepConcurrentSteps,
            stepAfterStep
        }

        currSteps.push(newStep)
        returnToDefault()
    }

    const updateStepinList = (index) => {
        // formatting duration into seconds 
        const min = +stepDuration[0];
        const sec = +stepDuration[1];

        if (stepType == "Duration" && (isNaN(min) || isNaN(sec))) {
            toast.error("Duration fields must be a valid numerical value!", toastStyling);
            return;
        }
        
        const newDuration = min*60 + sec;

        const newStep = {
            stepType,
            stepDescription,
            stepDuration: newDuration,
            stepConcurrentSteps,
            stepAfterStep
        }

        setCurrSteps((prevSteps) => {
            const updatedSteps = [...prevSteps]
            updatedSteps[index] = newStep
            return updatedSteps
        })

        returnToDefault()
    }

    const removeStepFromList = (key) => {
        setCurrSteps((prevSteps) => {
            const updatedSteps = [...prevSteps];
            updatedSteps.splice(key, 1);
            return updatedSteps;
        });
    }

    const startEditing = (key) => {
        setCurrProcess("editing")
        setEditingIndex(key)
        const currStep = currSteps[key]
        setStepType(currStep.stepType)
        setStepDescription(currStep.stepDescription)
        setStepDuration([minsIn(currStep.stepDuration), currStep.stepDuration%60])
        setStepConcurrentSteps(currStep.stepConcurrentSteps)
        setStepAfterStep(currStep.stepAfterStep)
    }

    const returnToDefault = () => {
        setCurrProcess("default")
        setStepType(undefined)
        setStepDescription(undefined)
        setStepDuration([undefined, undefined])
        setStepConcurrentSteps(undefined)
        setStepAfterStep(undefined)
        setEditingIndex(undefined)
    }
    
    const createRecipe = async() => {
        if (!isEdit) { // is creating a new post
            await axios.post("https://baby-chef-backend-031f48e42090.herokuapp.com/createRecipe", {
                title: location.state.title,
                description: location.state.description,
                ingredients: location.state.ingredients,
                creator: userId,
                steps: currSteps
            })
            .then(res => {
                if (res.data == "recipeexists") { //shouldn't really happen
                    toast.error("Recipe already exists!", toastStyling)
                } else if (res.data == "recipefail") {
                    toast.error("Unknown error, try again later", toastStyling)
                } else {
                    sessionStorage.setItem("itemStatus", "added")
                    history("/home", {state: {userId: userId, username: username}})
                }
            })
        } else {
            axios.post('https://baby-chef-backend-031f48e42090.herokuapp.com/edit', {
                id: recipeId,
                title: location.state.title,
                description: location.state.description,
                ingredients: location.state.ingredients,
                creator: userId,
                steps: currSteps
            })
            .then(res => {
                if (res.data == "updateSuccess") {
                    sessionStorage.setItem("itemStatus", "edited")
                    history("/home", {state: {userId: userId, username: username}})
                } else {
                    toast.error("Unknown error, try again later", toastStyling)
                }
            })
            .catch(err => {
                toast.error("Unknown error, try again later", toastStyling)
                console.log(err)
            });
        }
    }

    useEffect(() => {
        console.log(stepDescription)
    })

    return (
        <ThemeProvider theme={theme}>
        <div className="steps">
            <div className="createdStepsList">
            {currSteps.map((value, key) => {
                return <div className="createdStep">
                    { currProcess != "editing" || key != editingIndex
                        ? <div>
                            <div className="stepNumber">
                                Step {key + 1} ({value.stepType})
                            </div>
                            <div className="stepDescription">
                                <div>Description: {value.stepDescription}</div>
                                <div style={{marginTop: 10}}>{value.stepType == "Duration" ? `Duration: ${value.stepDuration} seconds`: ""}</div>
                                <div style={{marginTop: 10}}>{value.stepType == "Duration" ? `Concurrently: ${value.stepConcurrentSteps}` : ""}</div>
                                <div style={{marginTop: 10}}>{value.stepType == "Duration" ? `End of duration: ${value.stepAfterStep}` : ""}</div>
                            </div>
                        </div>
                        : <div>
                            <input type="text" 
                                onChange={(e) => {setStepDescription(e.target.value)}} 
                                placeholder="Description"
                                defaultValue = {value.stepDescription} 
                            />
                            <input type="text" 
                                onChange={(e) => {updateMin(e.target.value)}} 
                                placeholder="00" 
                                defaultValue={minsIn(value.stepDuration)}
                            /> min
                            <input type="text" 
                                onChange={(e) => {updateSec(e.target.value)}} 
                                placeholder="00" 
                                defaultValue={value.stepDuration%60}
                            /> sec
                            <input type="text" 
                                onChange={(e) => {setStepConcurrentSteps(e.target.value)}} 
                                placeholder="Concurrent Steps"
                                defaultValue={value.stepConcurrentSteps} 
                            />
                            <input type="text" 
                                onChange={(e) => {setStepAfterStep(e.target.value)}} 
                                placeholder="Ending step"
                                defaultValue={value.stepAfterStep} 
                            />
                            <input type="submit" onClick={() => updateStepinList(key)} />
                            <Button 
                                onClick={() => {setCurrProcess("default")}}
                                variant="outlined"
                                color="primary"
                                sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                            >Cancel</Button>
                        </div>               
                    }
                    { currProcess == "default"
                        ? <div>
                            <Button onClick={() => startEditing(key)}>Edit</Button>
                            <Button onClick={() => removeStepFromList(key)}>Delete</Button>
                        </div>
                        : <div></div>
                    }
                </div> 
            })}
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
                    <input className="detailsTextBox" onChange={(e) => {setStepDescription(e.target.value)}} placeholder="Description" />
                    <br></br>
                    <input className="time" onChange={(e) => {updateMin(e.target.value)}} placeholder="00" />{' min '} 
                    <input className="time" onChange={(e) => {updateSec(e.target.value)}} placeholder="00" />{' sec '}
                    <br></br>
                    <input className="detailsTextBox" onChange={(e) => {setStepConcurrentSteps(e.target.value)}} placeholder="Concurrent Steps" />
                    <br></br>
                    <input className="detailsTextBox" onChange={(e) => {setStepAfterStep(e.target.value)}} placeholder="Ending step" />
                    <br></br>
                    <Button onClick={addStepToList}
                        variant="outlined"
                        color="primary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}                  
                    >Submit</Button>
                    <Button 
                        onClick={() => {setCurrProcess("default")}}
                        variant="outlined"
                        color="secondary"
                        sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                    >Cancel</Button>
                  </div>
                : currProcess == "confirming"
                ? <Button 
                    onClick={createRecipe}
                    variant="outlined"
                    color="primary"
                    sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                  >{isEdit ? "Complete Edit" : "Create Recipe!"}</Button>
                : currProcess == "editing"
                ? <></>
                : <h1>Error!</h1>
            }
            <br />
            { currSteps.length >= 1 && currProcess == "default"
                ? <Button 
                    onClick={() => setCurrProcess("confirming")}
                    variant="outlined"
                    color="secondary"
                    sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                  >Confirm</Button>
                : <></>}
            <ToastContainer />
            </div>
        </div>
        <div>
            <IconButton>
                <HelpIcon style={{ width: 50, height: 50}}   />
            </IconButton>
        </div>
        </ThemeProvider>
    )
}

export default Steps;
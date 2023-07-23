import React from "react"
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from "axios"

import { Dialog, Button, createTheme, ThemeProvider, IconButton } from "@mui/material"
import HelpIcon from '@mui/icons-material/Help';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Steps.css'
import Popup from 'reactjs-popup';

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

    const [currSteps, setCurrSteps] = useState(location.state.steps)

    const userId = location.state.userId
    const username = location.state.username
    const [likedRecipes, setLikedRecipes] = useState(location.state.likedRecipes)

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    //this variable stores the current state of the step creation process
    const [currProcess, setCurrProcess] = useState("default")
    //default => can either submit steps created or add a new step
    //static/duration => choosing between a static or duration step
    //staticCreating => user is in the process of creating a static step
    //durationCreatingONE => user is in the process of creating a duration step (timed component)
    //durationCreatingTWO => user is in the process of creating a duration step (concurrent component)
    //confirming => user is in the process of confirming all steps created
    //editing => user is in the process of editting a step in the list

    //this variable stores the index of the step being edited
    const [editingIndex, setEditingIndex] = useState(undefined)
    //undefined => no element currently being edited

    const [editingProcess, setEditingProcess] = useState(undefined)
    //undefined => no step currently bring edited
    //static => step being edited is static
    //durationONE => step being edited is duration (timed component)
    //durationTWO => step being edited is duration (concurrent component)

    //store values input in forms
    const [stepType, setStepType] = useState(undefined)
    const [stepDescription, setStepDescription] = useState(undefined)
    //Duration stored in a length 2 array of [<mins>, <secs>]
    const [stepDuration, setStepDuration] = useState([0, 0])
    const [stepConcurrentSteps, setStepConcurrentSteps] = useState([""])
    const [stepAfterStep, setStepAfterStep] = useState(undefined)

    const updateMin = (newMin) => {
        setStepDuration((prevState) => [newMin, prevState[1]]);
    }

    const updateSec = (newSec) => {
        setStepDuration((prevState) => [prevState[0], newSec]);
    }

    const minsIn = (secs) => Math.floor(secs / 60)

    const checkStepBeforeContinuing = () => {
        const min = +stepDuration[0];
        const sec = +stepDuration[1];

        if (stepType == "Duration" && (isNaN(min) || isNaN(sec))) {
            toast.error("Duration fields must be a valid numerical value!", toastStyling);
            return;
        }
        setCurrProcess("durationCreatingTWO");
    }

    const addStepToList = () => {
        // formatting duration into seconds 
        const min = +stepDuration[0];
        const sec = +stepDuration[1];

        if (stepType == "Duration") {
            for (let index in stepConcurrentSteps) {
                if (stepConcurrentSteps[index].length == 0) {
                    toast.error("Concurrent steps cannot be empty!", toastStyling);
                    return;
                }
            }
        }

        const newDuration = min * 60 + sec;

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

        const newDuration = min * 60 + sec;

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
        setEditingProcess(currStep.stepType == "Static"
            ? "static"
            : "durationONE")
        setStepType(currStep.stepType)
        setStepDescription(currStep.stepDescription)
        setStepDuration([minsIn(currStep.stepDuration), currStep.stepDuration % 60])
        setStepConcurrentSteps(currStep.stepConcurrentSteps)
        setStepAfterStep(currStep.stepAfterStep)
    }

    const returnToDefault = () => {
        setCurrProcess("default")
        setStepType(undefined)
        setStepDescription(undefined)
        setStepDuration([0, 0])
        setStepConcurrentSteps([""])
        setStepAfterStep(undefined)
        setEditingIndex(undefined)
    }

    const createRecipe = async () => {
        if (!isEdit) { // is creating a new post
            await axios.post("https://baby-chef-backend-031f48e42090.herokuapp.com/createRecipe", {
                title: location.state.title,
                description: location.state.description,
                ingredients: location.state.ingredients,
                image: location.state.image,
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
                        history("/home", { state: { userId, username, likedRecipes } })
                    }
                })
        } else {
            axios.post('https://baby-chef-backend-031f48e42090.herokuapp.com/edit', {
                id: recipeId,
                title: location.state.title,
                description: location.state.description,
                ingredients: location.state.ingredients,
                image: location.state.image,
                creator: userId,
                steps: currSteps
            })
                .then(res => {
                    if (res.data == "updateSuccess") {
                        sessionStorage.setItem("itemStatus", "edited")
                        history("/home", { state: { userId, username, likedRecipes } })
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

    const [open, setOpen] = useState(false);

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="steps">
                <div className="createdStepsList">
                    <Link
                        to={`/view/${recipeId}`}
                        state={{
                            username: username,
                            userId: userId,
                        }}
                    ><ArrowBackIcon className='backArrow' /></Link>
                    {currSteps.map((value, key) => {
                        return <div className="createdStep">
                            {currProcess != "editing" || key != editingIndex
                                ? <div>
                                    <div className="stepNumber">
                                        Step {key + 1} ({value.stepType})
                                    </div>
                                    <div className="stepDescription">
                                        <div>Description: {value.stepDescription}</div>
                                        <div style={{ marginTop: 10 }}>
                                            {value.stepType == "Duration"
                                                ? `Duration: ${value.stepDuration} seconds`
                                                : ""
                                            }
                                        </div>
                                        <div style={{ marginTop: 10 }}>
                                            {value.stepType == "Duration" && Array.isArray(value.stepConcurrentSteps)
                                                ? `Concurrently: ${value.stepConcurrentSteps.reduce((h, acc) => h + ", " + acc)}`
                                                : ""
                                            }
                                        </div>
                                        <div style={{ marginTop: 10 }}>
                                            {value.stepType == "Duration"
                                                ? `End of duration: ${value.stepAfterStep}`
                                                : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                                : value.stepType == "Duration"
                                    ? editingProcess == "durationONE"
                                        ? <div>
                                            <input className="detailsTextBox"
                                                type="text"
                                                onChange={(e) => { setStepDescription(e.target.value) }}
                                                placeholder="Description"
                                                defaultValue={value.stepDescription} />
                                            <br></br>
                                            <input className="time"
                                                type="text"
                                                onChange={(e) => { updateMin(e.target.value) }}
                                                placeholder="00"
                                                defaultValue={minsIn(value.stepDuration)} />{' min '}
                                            <input className="time"
                                                type="text"
                                                onChange={(e) => { updateSec(e.target.value) }}
                                                placeholder="00"
                                                defaultValue={value.stepDuration % 60} />{' sec '}
                                            <br></br>
                                            <input className="detailsTextBox"
                                                onChange={(e) => { setStepAfterStep(e.target.value) }}
                                                placeholder="Ending step"
                                                defaultValue={value.stepAfterStep} />
                                            <br></br>
                                            <Button
                                                onClick={() => {
                                                    const min = +stepDuration[0];
                                                    const sec = +stepDuration[1];

                                                    if (stepType == "Duration" && (isNaN(min) || isNaN(sec))) {
                                                        toast.error("Duration fields must be a valid numerical value!", toastStyling);
                                                        return;
                                                    }
                                                    setEditingProcess("durationTWO");
                                                }}
                                                variant="outlined"
                                                color="primary"
                                                sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                            >Next</Button>
                                            <Button
                                                onClick={() => { setCurrProcess("default") }}
                                                variant="outlined"
                                                color="secondary"
                                                sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                            >Cancel</Button>
                                        </div>
                                        : <div>
                                            <h4>Concurrent Steps</h4>
                                            <div className="concurrentSteps">
                                                {stepConcurrentSteps.map((step, index) =>
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        value={step}
                                                        onChange={(e) => {
                                                            const updatedSteps = [...stepConcurrentSteps];
                                                            updatedSteps[index] = e.target.value;
                                                            setStepConcurrentSteps(updatedSteps);
                                                        }}
                                                        placeholder="Concurrent Step"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <Button onClick={() => {
                                                    setStepConcurrentSteps([...stepConcurrentSteps, ""]);
                                                }}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >+</Button>
                                                <Button onClick={() => {
                                                    setStepConcurrentSteps(prevSteps => {
                                                        const updatedSteps = [...prevSteps];
                                                        updatedSteps.pop();
                                                        return updatedSteps;
                                                    });
                                                }}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >-</Button>
                                            </div>
                                            <div>
                                                <Button
                                                    onClick={returnToDefault}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >Cancel</Button>
                                                <Button onClick={() => updateStepinList(key)}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >Edit Step</Button>
                                            </div>
                                        </div>
                                    : <div>
                                        <input type="text" onChange={(e) => { setStepDescription(e.target.value) }} placeholder="Description" defaultValue={value.stepDescription} />
                                        <Button
                                            onClick={() => updateStepinList(key)}
                                            variant="outlined"
                                            color="primary"
                                            sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                        >Create Step</Button>
                                        <Button
                                            onClick={returnToDefault}
                                            variant="outlined"
                                            color="primary"
                                            sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                        >Cancel</Button>
                                    </div>
                            }
                            {currProcess == "default"
                                ? <div>
                                    <Button onClick={() => startEditing(key)}>Edit</Button>
                                    <Button onClick={() => removeStepFromList(key)}>Delete</Button>
                                </div>
                                : <div></div>
                            }
                        </div>
                    })}
                    {currProcess == "default"
                        ? <Button
                            onClick={() => { setCurrProcess("static/duration") }}
                            variant="outlined"
                            color="primary"
                            sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}>
                            + Add Step</Button>
                        : currProcess == "static/duration"
                            ? <div>
                                <Button
                                    onClick={() => { setCurrProcess("staticCreating"); setStepType("Static") }}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                >Static</Button>
                                <Button
                                    onClick={() => { setCurrProcess("durationCreatingONE"); setStepType("Duration") }}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                >Duration</Button>
                                <Button
                                    onClick={() => { setCurrProcess("default") }}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                >Cancel</Button>
                            </div>
                            : currProcess == "staticCreating"
                                ? <div>
                                    <input type="text" onChange={(e) => { setStepDescription(e.target.value) }} placeholder="Description" />
                                    <Button
                                        onClick={addStepToList}
                                        variant="outlined"
                                        color="primary"
                                        sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                    >Create Step</Button>
                                    <Button
                                        onClick={returnToDefault}
                                        variant="outlined"
                                        color="primary"
                                        sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                    >Cancel</Button>
                                </div>
                                : currProcess == "durationCreatingONE"
                                    ? <div>
                                        <input className="detailsTextBox" onChange={(e) => { setStepDescription(e.target.value) }} placeholder="Description" />
                                        <br></br>
                                        <input className="time" onChange={(e) => { updateMin(e.target.value) }} defaultValue="0" />{' min '}
                                        <input className="time" onChange={(e) => { updateSec(e.target.value) }} defaultValue="0" />{' sec '}
                                        <br></br>
                                        <input className="detailsTextBox" onChange={(e) => { setStepAfterStep(e.target.value) }} placeholder="Ending step" />
                                        <br></br>
                                        <Button
                                            onClick={checkStepBeforeContinuing}
                                            variant="outlined"
                                            color="primary"
                                            sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                        >Next</Button>
                                        <Button
                                            onClick={() => { setCurrProcess("default") }}
                                            variant="outlined"
                                            color="secondary"
                                            sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                        >Cancel</Button>
                                    </div>
                                    : currProcess == "durationCreatingTWO"
                                        ? <div>
                                            <h4>Concurrent Steps</h4>
                                            <div className="concurrentSteps">
                                                {Array.isArray(stepConcurrentSteps)
                                                    ? stepConcurrentSteps.map((step, index) =>
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            value={step}
                                                            onChange={(e) => {
                                                                const updatedSteps = [...stepConcurrentSteps];
                                                                updatedSteps[index] = e.target.value;
                                                                setStepConcurrentSteps(updatedSteps);
                                                            }}
                                                            placeholder="Concurrent Step"
                                                        />
                                                    )
                                                    : <></>
                                                }
                                            </div>
                                            <div>
                                                <Button onClick={() => {
                                                    setStepConcurrentSteps([...stepConcurrentSteps, ""]);
                                                }}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >+</Button>
                                                <Button onClick={() => {
                                                    setStepConcurrentSteps(prevSteps => {
                                                        const updatedSteps = [...prevSteps];
                                                        updatedSteps.pop();
                                                        return updatedSteps;
                                                    });
                                                }}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >-</Button>
                                            </div>
                                            <div>
                                                <Button
                                                    onClick={returnToDefault}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >Cancel</Button>
                                                <Button onClick={addStepToList}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                                >Submit</Button>
                                            </div>
                                        </div>
                                        : currProcess == "confirming"
                                            ? <Button
                                                onClick={createRecipe}
                                                variant="outlined"
                                                color="primary"
                                                sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                                            >{isEdit ? "Complete Edit" : "Create Recipe!"}</Button>
                                            : currProcess == "editing"
                                                ? <></>
                                                : <h1>Error!</h1>
                    }
                    <br />
                    {currSteps.length >= 1 && currProcess == "default"
                        ? <Button
                            onClick={() => setCurrProcess("confirming")}
                            variant="outlined"
                            color="secondary"
                            sx={{ border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px' }}
                        >Confirm</Button>
                        : <></>}
                    <ToastContainer />
                </div>
            </div>
            <div>
                <div>
                    {/* Clicking HelpIcon will trigger the modal */}
                    <IconButton onClick={handleOpenModal}>
                        <HelpIcon style={{ width: 50, height: 50 }} />
                    </IconButton>
                    <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
                        {/* Scrollable content */}
                        <div style={{ width: '90%', maxHeight: '70vh', overflowY: 'auto', padding: '16px' }}>
                            <div>
                                BabyChef aims to provide learning chefs with simple to follow step-by-step instructions.
                                As such, it is recommended that you break down your steps into smaller short steps!
                                <br></br><hr></hr>
                                <strong>Static Step:</strong> Steps that do not have a timed component.
                                <br></br>
                                <br></br><strong>Examples:</strong>
                                <br></br>Dice the potatoes into 1-inch cubes
                                <br></br>Fill a pot of water and get it to a rolling boil
                                <br></br><hr></hr>
                                <strong>Duration Step:</strong> Steps that contains a timed element. A timer will be started automatically for those following this step. The <i><strong>ending message</strong></i> will be shown once the timer is up
                                <br></br><br></br>
                                There is also an option to include <i><strong>concurrent steps</strong></i>, which are steps that can be performed whilst waiting for the original <i><strong>duration step</strong></i> to finish.
                                It will be necessary to complete both the original <i><strong>duration step</strong></i>, and all <i><strong>concurrent steps</strong></i>, before moving on to the next step.
                                <br></br>
                                <br></br><strong>Example:</strong>
                                <br></br><i>Descripton</i>: Put diced potatoes into boiling water
                                <br></br><i>Duration</i>: 20 min 0 sec
                                <br></br><i>Concurrent Steps</i>: Chop carrots into small pieces
                                <br></br><i>Ending step</i>: Off the heat and take potatoes out
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Steps;
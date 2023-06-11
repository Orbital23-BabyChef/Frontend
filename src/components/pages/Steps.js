import React from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from "@mui/material"
import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [stepDescription, setStepDescription] = useState(undefined)
    const [stepDuration, setStepDuration] = useState(undefined)
    const [stepConcurrentSteps, setStepConcurrentSteps] = useState(undefined)
    const [stepAfterStep, setStepAfterStep] = useState(undefined)

    const addStepToList = () => {
        const newStep = {
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
        <div className="steps">
            {currSteps.map((value, key) => {
                return <div>
                    <hr />
                    <div>
                        {value.stepDescription}
                        <br />
                        {value.stepDuration ? value.stepDuration + " seconds" : ""}
                        <br />
                        {value.stepConcurrentSteps}
                        <br />
                        {value.stepAfterStep}
                    </div>
                </div>
            })}
            { currProcess == "default" 
                ? <Button onClick={() => {setCurrProcess("static/duration")}}>Add Step</Button>
                : currProcess == "static/duration"
                ? <div>
                    <Button onClick={() => {setCurrProcess("staticCreating")}}>Static</Button>
                    <Button onClick={() => {setCurrProcess("durationCreating")}}>Duration</Button>
                    <Button onClick={() => {setCurrProcess("default")}}>Cancel</Button>
                  </div>
                : currProcess == "staticCreating"
                ? <div>
                    <input type="text" onChange={(e) => {setStepDescription(e.target.value)}} placeholder="Description" />
                    <Button onClick={addStepToList}>Create Step</Button>
                    <Button onClick={returnToDefault}>Cancel</Button>
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
                ? <Button onClick={createRecipe}>Create Recipe!</Button>
                : <h1>Error!</h1>
            }
            <br />
            {currSteps.length >= 1 && currProcess == "default"
                ? <Button onClick={() => setCurrProcess("confirming")}>Confirm</Button>
                : <></>}
            <ToastContainer />
        </div>
    )
}

export default Steps
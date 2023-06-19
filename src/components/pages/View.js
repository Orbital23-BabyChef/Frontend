import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { React, useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function View (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)

    const history = useNavigate()
    
    const recipeId = useParams().id
    const [ recipe, setRecipe ] = useState("")

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    const submit = () => {
        confirmAlert({
            title: 'Delete Confirmation',
            message: 'Are you sure you would like to delete this recipe? This action is irreversible.',
            buttons: [
              {
                label: 'OK',
                onClick: () => {
                    try {
                        axios.post("https://baby-chef.herokuapp.com/delete/", { recipeId })
                        .then(res => {
                            if (res.data == "deleteSuccess") {
                                sessionStorage.setItem("itemStatus", "deleted")
                                history("/home", {state:{userId:userId, username:username}})
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


    return (
        <div className="view">
            {recipe ? (
                <>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description}</p>
                    <p>{recipe.ingredients}</p>
                    <p>{recipe.instructions}</p>
                    <hr />
                    <p>Instruction Preview:</p>
                    {recipe.steps.map((value, key) => {
                        return <div> 
                            <h4>Step X</h4>
                            <p>{value.stepDescription}</p>
                            {value.stepType == "Duration" 
                            ? <div>
                                <p>{value.stepConcurrentSteps}</p>
                                <p>{value.stepDuration}</p>
                                <p>{value.stepConcurrentSteps}</p>
                                <p>{value.stepAfterSteps}</p>
                              </div>
                            : <></>}
                        </div>
                    })}
                    <hr />
                    <p>Creator: {recipe.creator}</p>
                    {recipe.creator ==  username ? ( 
                        <>
                            <Link to={`/edit/${recipeId}`} state={{
                                    userId: userId,
                                    username: username,
                                    title: recipe.title,
                                    description: recipe.description,
                                    ingredients: recipe.ingredients,
                                    instructions: recipe.instructions,
                                    steps: recipe.steps
                                }}>
                                Edit
                            </Link>
                            <br></br>
                            <button onClick={submit}>Delete</button>
                        </>
                    ) : null}
                </>
            ) : null}
            <ToastContainer />
        </div>
      );

}

export default View
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { React, useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios"


function View (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)
    console.log(username)

    const history = useNavigate()
    
    const recipeId = useParams().id
    const [ recipe, setRecipe ] = useState("")

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
                                alert("Record successfully deleted.")
                                history("/home", {state:{userId:userId, username:username}})
                            } else {
                                alert("Error!")
                            }
                        })
                        .catch(e => {
                            alert("Error!")
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
                alert("Error!")
                console.log(e)
            });
        } catch (e) {
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
                    <p>Creator: {recipe.creator}</p>
                    {recipe.creator ==  username ? ( 
                        <>
                            <Link to={`/edit/${recipeId}`} state={{
                                    userId: userId,
                                    username: username,
                                    title: recipe.title,
                                    description: recipe.description,
                                    ingredients: recipe.ingredients,
                                    instructions: recipe.instructions
                                }}>
                                Edit
                            </Link>
                            <br></br>
                            <button onClick={submit}>Delete</button>
                        </>
                    ) : null}
                </>
            ) : null}
        </div>
      );

}

export default View
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom'
import { React, useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios"


function View (){
    const location = useLocation()
    const currUser = location.state.currUser

    const history = useNavigate();
    
    const { id } = useParams()
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
                        axios.post("http://localhost:3001/delete/", { id })
                        .then(res => {
                            if (res.data == "deleteSuccess") {
                                alert("Record successfully deleted.")
                                history("/home", {state:{id:currUser}})
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
        try {
            axios.post("http://localhost:3001/recipe", { id })
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
                    {recipe.creator == currUser ? ( 
                        <>
                            <Link to={`/edit/${id}`} state={{ id: id, currUser: currUser }}>
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
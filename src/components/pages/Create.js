import React from "react"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Create.css'
import { Button, createTheme, ThemeProvider } from "@mui/material"
import imageCompression from 'browser-image-compression';

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

function Create (){
    const location = useLocation()
    const userId = location.state.userId
    const [username, setUsername] = useState(location.state.username)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [image, setImage] = useState(null)
    
    const history = useNavigate();

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    //Sets username 
    useEffect(() => {
        axios.get(`https://baby-chef-backend-031f48e42090.herokuapp.com/username/?id=${userId}`)
        .then(res => {
            setUsername(res.data.username);
        })
    })

    const compressImage = async (file) => {
        try {
          const options = {
            maxSizeMB: 9, // Set the maximum file size in megabytes
            useWebWorker: true,
          };
    
          const compressedFile = await imageCompression(file, options);
          return compressedFile;
        } catch (error) {
          console.error('Error compressing image:', error);
          return null;
        }
      };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        setImage(file);
    
        // Compress the image and handle it as needed
        const compressedImage = await compressImage(file);
        setImage(compressedImage)
      };
    

    const addToList = () => {
        if (title.length < 3) {
            toast.error("TITLE cannot be less than 3 characters long", toastStyling)
        } else if (description.length < 3) {
            toast.error("DESCRIPTION cannot be less than 3 characters long", toastStyling)
        } else if (ingredients.length < 3) {
            toast.error("INGREDIENTS cannot be less than 3 characters long", toastStyling)
        } else {
            axios.post('https://baby-chef-backend-031f48e42090.herokuapp.com/checkRecipe', {
                title: title,
                description: description,
                ingredients: ingredients,
                creator: userId,
            })
            .then(res => {
                if (res.data == "recipeexist") {
                    toast.error("Recipe already exists!", toastStyling)
                } else if (res.data == "recipefail") {
                    toast.error("Unknown error, try again later", toastStyling)
                } else {
                    
                    //If no image uploaded
                    if (!image) {
                        history("/steps/create", {state:{
                            userId: userId,
                            title: title,
                            description: description,
                            ingredients: ingredients,
                            image: image, // Pass the null image
                            username: username,
                            steps: []
                        }});
                        return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Image = reader.result;
                        
                        // Pass the Base64 image data using history.push()
                        history("/steps/create", {state:{
                            userId: userId,
                            title: title,
                            description: description,
                            ingredients: ingredients,
                            image: base64Image, // Pass the Base64 data URI
                            username: username,
                            steps: []
                        }});
                    };

                    // Read the selected image as Data URL (Base64)
                    reader.readAsDataURL(image);
                }
            });
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <div className="create">
            <div className="createTitle">
            <label>Name of Dish</label>
            <br></br>
            <textarea className="nameOfDish"
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
            />
            </div>
            <br></br>
            <div>
            <label>Description</label>
            <br></br>
            <textarea className="descriptionText"
                onChange={(event) => {
                    setDescription(event.target.value)
                }}
            />
            </div>
            <br></br>
            <div>
            <label>Ingredients</label>
            <br></br>
            <textarea className="ingredientsText"
                onChange={(event) => {
                    setIngredients(event.target.value)
                }}
            />
            </div>
            <br></br>
            <div>
                <label>Upload Image</label>
                <br></br><br></br>
                <input type="file" className="imageUpload"
                    onChange={handleImageChange}>
                </input>
            </div>
            <br></br>
            <Button 
                variant="outlined"
                color="primary"
                sx={{border: 2, fontWeight: 'bold', fontSize: 16, margin: '10px'}}
                onClick={addToList}>Next Step</Button>
            <ToastContainer />
        </div>
        </ThemeProvider>
    )
}

export default Create
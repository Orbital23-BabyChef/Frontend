import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import logo from '../logo.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const history = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const toastStyling = {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
        autoClose: 3000
    }

    async function submit(e){
        e.preventDefault();

        try{

            await axios.post("https://baby-chef.herokuapp.com/signup",{
                username, password, confirmPassword
            })
            .then(res => {
                if (res.data == "exist") {
                    toast.error("Username already exists!", toastStyling)
                }
                else if(res.data == "mismatch"){
                    toast.error("Passswords do not match!", toastStyling)
                }
                else {
                    history("/home", {state: {userId: res.data, username: username}})
                }
            })
            .catch(e => {
                toast.error("Unknown error, try again later", toastStyling)
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (
        <div className="centered-div">
            <div>
                <img className="logo" src={logo} alt="Logo" />
            </div>

            <h1>Create an account now!</h1>

            <form action="POST">
                <input type="username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username"  />
                <br></br>
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                <br></br>
                <input type="password" onChange={(e) => { setConfirmPassword(e.target.value) }} placeholder="Confirm Password" />
                <br></br>
                <br></br>
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <Link to="/">Login Page</Link>
            <ToastContainer />
        </div>
    )
}

export default Signup
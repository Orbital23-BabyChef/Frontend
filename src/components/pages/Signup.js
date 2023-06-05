import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import logo from '../logo.png'

function Signup() {
    const history = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    async function submit(e){
        e.preventDefault();

        try{

            await axios.post("https://baby-chef.herokuapp.com/username/signup",{
                username, password, confirmPassword
            })
            .then(res => {
                if (res.data == "exist") {
                    alert("User already exists!")
                }
                else if(res.data == "mismatch"){
                    alert("Passwords do not match!")
                }
                else {
                    history("/home", {state: {userId: res.data, username: username}})
                }
            })
            .catch(e => {
                alert("Error!")
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (
        <div className="centered-div">
            <div className="logo">
                <img src={logo} alt="Logo" />
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

        </div>
    )
}

export default Signup
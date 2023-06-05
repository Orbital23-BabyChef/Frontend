import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import './Login.css'
import logo from '../logo.png'


function Login() {

    const history = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e){
        e.preventDefault();

        try{
            await axios.post("https://baby-chef.herokuapp.com/login",{
                username, password
            })
            .then(res => {
                if (res.data){
                    history("/home", {state: {currId: res.data._id}})
                } else {
                    alert("Incorrect Credentials")
                }
            })
            .catch(e => {
                alert("Error!")
                console.log(e)
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (
        <div 
            className="centered-div">
                <div className="logo">
                <img src={logo} alt="Logo" />
                </div>
            
            <h1>Login</h1>

            <form action="POST">
                <input type="username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username"  />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password"  />
                <br></br>
                <br></br>
                <input type="submit" onClick={submit} />

            </form>
            <br></br>
            <Link to="/signup">Create a new account instead</Link>

        </div>
    )
}

export default Login
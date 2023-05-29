import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"


function Signup() {
    const history = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    async function submit(e){
        e.preventDefault();

        try{

            await axios.post("https://baby-chef.herokuapp.com/signup",{
                username, password, confirmPassword
            })
            .then(res => {
                if (res.data == "exist") {
                    alert("User already exists!")
                }
                else if(res.data == "mismatch"){
                    alert("Passwords do not match!")
                }
                else if(res.data == "notexist"){
                    history("/home", {state: {id: username}})
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
        <div className="signup">

            <h1>Signup</h1>

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
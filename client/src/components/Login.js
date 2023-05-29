import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"


function Login() {

    const history = useNavigate();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e){
        e.preventDefault();

        try{
            await axios.post("https://baby-chef.herokuapp.com/",{
                username, password
            })
            .then(res => {
                if (res.data == "exist"){
                    history("/home", {state: {id: username}})
                }else if( res.data == "notexist"){
                    alert("Incorrect Credentials")
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
        <div className="login">

            <h1>Login</h1>

            <form action="POST">
                <input type="username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username"  />
                <br></br>
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password"  />
                <br></br>
                <br></br>
                <input type="submit" onClick={submit} />

            </form>
            <br></br>
            <Link to="/signup">Signup Page</Link>

        </div>
    )
}

export default Login
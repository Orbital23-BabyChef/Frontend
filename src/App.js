// import './App.css'
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Create from "./components/Create"
import View from "./components/View"
import Profile from "./components/Profile"
import Edit from "./components/Edit"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/view/:id" element={<View/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/edit/:id" element={<Edit/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
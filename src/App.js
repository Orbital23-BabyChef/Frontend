// import './App.css'
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"
import Create from "./components/pages/Create"
import View from "./components/pages/View"
import Profile from "./components/pages/Profile"
import Edit from "./components/pages/Edit"
import Steps from "./components/pages/Steps"
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
          <Route path="/steps/:id" element={<Steps/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
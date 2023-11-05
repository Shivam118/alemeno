import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CourseDesc from "./pages/CourseDesc";
import StudentDashboard from "./pages/StudentDashboard";
import NavBar from "./components/NavBar";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />
        <Route path="course">
          <Route path=":id" element={<CourseDesc />} />
        </Route>
        <Route path="user" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

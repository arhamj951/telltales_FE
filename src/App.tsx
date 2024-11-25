import React, { Dispatch, SetStateAction, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import Blog from "./components/Blog";
import CreatePost from "./components/Blog/components/Posts/components/CreatePost";
import NavBar from "./components/NavBar";
import { UserProvider } from "./components/context/UserContext";
import AdminDashBoard from "./components/AdminDashBoard";
import MyPosts from "./components/MyPosts";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/blog" />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/blog"
            element={
              <>
                <NavBar setSearchTerm={setSearchTerm} />
                <Blog searchTerm={searchTerm} />
              </>
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <>
                <NavBar setSearchTerm={setSearchTerm}></NavBar>
                <AdminDashBoard searchTerm={searchTerm} />
              </>
            }
          />
          <Route
            path="/myPosts"
            element={
              <>
                <NavBar setSearchTerm={setSearchTerm}></NavBar>
                <MyPosts searchTerm={searchTerm} />
              </>
            }
          />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

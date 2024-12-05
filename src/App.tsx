import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import Blog from "./components/Blog";
import CreatePost from "./components/Blog/components/Posts/components/CreatePost";
import NavBar from "./components/NavBar";
import AdminDashBoard from "./components/AdminDashBoard";
import MyPosts from "./components/MyPosts";
import { useUser } from "./components/context/UserContext";
import ResetPassword from "./components/auth/SignIn/components/ResetPassword";
import { Box } from "@mui/material";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { user } = useUser();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/blog" />} />
        <Route
          path="/sign-in"
          element={!user.isAuthenticated ? <SignIn /> : <Navigate to="/blog" />}
        />
        <Route
          path="/sign-up"
          element={!user.isAuthenticated ? <SignUp /> : <Navigate to="/blog" />}
        />
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
              {user.admin ? (
                <AdminDashBoard searchTerm={searchTerm} />
              ) : (
                <Navigate to="/blog" />
              )}
            </>
          }
        />
        <Route
          path="/myPosts"
          element={
            <>
              <NavBar setSearchTerm={setSearchTerm}></NavBar>
              {user.isAuthenticated ? (
                <MyPosts searchTerm={searchTerm} />
              ) : (
                <Navigate to="/blog" />
              )}
            </>
          }
        />
        <Route
          path="/create-post"
          element={
            user.isAuthenticated ? <CreatePost /> : <Navigate to="/blog" />
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            user.isAuthenticated ? (
              <Navigate to="/blog" />
            ) : (
              <>
                <NavBar setSearchTerm={setSearchTerm} />
                <Box>
                  <ResetPasswordWrapper />
                </Box>
              </>
            )
          }
        />
        <Route path="*" element={<Navigate to="/blog" />} />
      </Routes>
    </Router>
  );
}

const ResetPasswordWrapper = () => {
  const { token } = useParams<{ token: string }>();
  return token ? <ResetPassword token={token} /> : <Navigate to="/blog" />;
};

export default App;

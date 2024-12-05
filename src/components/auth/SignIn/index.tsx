import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Checkbox,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Typography,
  Snackbar,
} from "@mui/material";
import { darkTheme } from "../../../Theme/theme";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

import {
  Card,
  AnimatedButton,
  AnimatedTextField,
  AuthContainer,
} from "../styledComponents";

import { apiRequest } from "../../../services/apiClient";
import { User } from "../../../types/types";
import ForgotPassword from "./components/ForgotPassword";

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { login } = useUser();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const [rememberMe, setRememberMe] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response = await apiRequest("post", "/users/login/", {
        email,
        password,
      });

      const receivedUser: User = {
        _id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        password: "",
        avatar: response.data.user.image,
        admin: response.data.user.admin,
        isAuthenticated: true,
      };

      await login(receivedUser);

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(receivedUser));
      }

      navigate("/blog");
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setSnackbarMessage(
          "Invalid credentials. Please check your email and password."
        );
      } else {
        setSnackbarMessage("Sign in failed. Please try again later.");
      }
      setSnackbarOpen(true);
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <AuthContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <AnimatedTextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                error={emailError}
                helperText={emailErrorMessage}
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <AnimatedTextField
                id="password"
                type="password"
                name="password"
                placeholder="••••••"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordErrorMessage}
                fullWidth
              />
            </FormControl>
            <ForgotPassword open={open} handleClose={handleClose} />
            <AnimatedButton type="submit" fullWidth variant="contained">
              Sign In
            </AnimatedButton>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
            <AnimatedButton
              type="button"
              fullWidth
              variant="contained"
              onClick={() => navigate("/blog")}
            >
              Continue without sign in
            </AnimatedButton>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" variant="body2">
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Card>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </AuthContainer>
    </ThemeProvider>
  );
}

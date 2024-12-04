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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        email: email,
        password: password,
      });

      let recieveddUser: User = {
        _id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        password: response.data.user.password,
        avatar: response.data.user.image,
        admin: response.data.user.admin,
        isAuthenticated: true,
      };

      await login(recieveddUser);
      navigate("/blog");
      alert("Sign in successful!");
    } catch (error) {
      alert("Sign in failed. Please try again.");
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <AnimatedButton
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
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
              type="submit"
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
      </AuthContainer>
    </ThemeProvider>
  );
}

import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { apiRequest } from "../../../../../services/apiClient";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");

      setLoading(true);
      setError("");

      try {
        const response = await apiRequest("post", "/users/reset-password", {
          token,
          password,
        });
        alert(response.data.message);
        navigate("/sign-in");
      } catch (error: any) {
        const statusCode = error.response?.status;
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred.";
        console.log("Error", statusCode, errorMessage);
        setError(`Failed to reset password: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={true} sx={{ zIndex: 1200 }}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <form onSubmit={handleResetPassword}>
          <Box my={4}>
            <TextField
              required
              fullWidth
              type="password"
              label="New Password"
              value={password}
              error={passwordError}
              helperText={passwordErrorMessage}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />
          </Box>
          <Box my={2}>
            <TextField
              required
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
            />
          </Box>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <DialogActions>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;

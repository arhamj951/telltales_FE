import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { apiRequest } from "../../../../../services/apiClient";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("post", "/users/reset-password", {
        token,
        password,
      });
      console.log(response.data.message);
    } catch (error: any) {
      setError("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true}>
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

// src/components/auth/ResetPassword.tsx

import React, { useState } from "react";
import {
  Button,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { apiRequest } from "../../../../../services/apiClient";

interface ResetPasswordProps {
  token: string; // The reset token received by email
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
      // Redirect or show a success message
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
          <OutlinedInput
            required
            margin="dense"
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <OutlinedInput
            required
            margin="dense"
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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

import * as React from "react";
import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Popper, Fade, Paper } from "@mui/material";
import Notifications from "./components/Notifications";
import { Link } from "react-router-dom";
import { Search, SearchIconWrapper, StyledInputBase } from "./styledComponents";
import { apiRequest } from "../../services/apiClient";
import { Alert } from "../../types/types";

type ChildComponentProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

export default function PrimarySearchAppBar({
  setSearchTerm,
}: ChildComponentProps) {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [anchorElNotification, setAnchorElNotification] =
    React.useState<HTMLButtonElement | null>(null);

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const handleNotificationClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElNotification(event.currentTarget);
    setOpenModal((prev) => !prev);
  };

  const getNotifications = async () => {
    if (!user || !user.isAuthenticated) {
      setAlerts([]);
      return;
    }

    const endpoint = user.admin ? "/alerts" : `/alerts/${user._id}/alerts`;

    try {
      const response = await apiRequest("get", endpoint);
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/blog");
  };

  useEffect(() => {
    getNotifications();
  }, [user]);

  return (
    <Box position="relative" sx={{ flexGrow: 1, zIndex: 1400 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="h6"
              component={Link}
              to="/blog"
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Tell-Tales
            </Typography>
          </Box>
          <Box>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Explore the Unknown..."
                inputProps={{ "aria-label": "search" }}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </Search>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {user.isAuthenticated && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/myposts");
                }}
              >
                My Posts
              </Button>
            )}
            {user.admin && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/adminDashboard");
                }}
              >
                Admin DashBoard
              </Button>
            )}
            {user.isAuthenticated && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/create-post");
                }}
              >
                Create A Post
              </Button>
            )}
            {!user.isAuthenticated && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                Login/SignUp
              </Button>
            )}
            {user.isAuthenticated && (
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            )}
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge
                badgeContent={alerts.filter((alert) => !alert.read).length}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Popper
              sx={{ zIndex: 1200 }}
              open={openModal}
              anchorEl={anchorElNotification}
              placement="bottom-end"
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Notifications alerts={alerts} setAlerts={setAlerts} />
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

import * as React from "react";
import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Popper, Fade, Paper } from "@mui/material";
import Notifications, { Alert } from "./components/Notifications";
import { Link } from "react-router-dom";
import { Search, SearchIconWrapper, StyledInputBase } from "./styledComponents";
import { apiRequest } from "../../services/apiClient";

type ChildComponentProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>; // Define the type for the setCount prop
};

export default function PrimarySearchAppBar({
  setSearchTerm,
}: ChildComponentProps) {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElNotification, setAnchorElNotification] =
    React.useState<HTMLButtonElement | null>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    getNotifications();
  }, [user]);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
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
              <Badge badgeContent={alerts.length} color="error">
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
                    <Notifications alerts={alerts} />
                  </Paper>
                </Fade>
              )}
            </Popper>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

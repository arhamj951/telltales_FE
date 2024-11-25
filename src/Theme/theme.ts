import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    primary: {
      main: "#BB86FC",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A5A5A5",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
    h4: {
      fontWeight: 700,
    },
    body2: {
      fontWeight: 500,
    },
  },
});

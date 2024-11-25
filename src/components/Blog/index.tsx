import * as React from "react";
import Footer from "./components/Footer";
import {
  Box,
  Container,
  CssBaseline,
  styled,
  ThemeProvider,
} from "@mui/material";
import Posts from "./components/Posts";
import { useUser } from "../context/UserContext";
import { darkTheme } from "../../Theme/theme";
import Typography from "@mui/material/Typography";
import { useState } from "react";

// Styled Blog Container with gradient background
export const BlogStyledComponent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh", // Set minHeight to fill the viewport
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(8), // Ensure space for footer at the bottom
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function Blog(props: {
  searchTerm: string;
  disableCustomTheme?: boolean;
}) {
  const { user } = useUser();
  const [ifMyPosts, setIfMyPosts] = useState<boolean>(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <BlogStyledComponent>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1, // Ensures the content fills available space
            gap: 4,
          }}
        >
          <div>
            <div>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
                User Info
              </Typography>
              <p>ID: {user?._id || "N/A"}</p>
              <p>Name: {user?.name || "N/A"}</p>
              <p>Email: {user?.email || "N/A"}</p>
              <img src={user?.avatar} />
            </div>
          </div>
          <Posts searchTerm={props.searchTerm} ifMyPosts={ifMyPosts} />
        </Container>
      </BlogStyledComponent>
      <Footer />
    </ThemeProvider>
  );
}

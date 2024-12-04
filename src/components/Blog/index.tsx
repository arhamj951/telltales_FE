import * as React from "react";
import Footer from "./components/Footer";
import { Container, CssBaseline, styled, ThemeProvider } from "@mui/material";
import Posts from "./components/Posts";
import { useUser } from "../context/UserContext";
import { darkTheme } from "../../Theme/theme";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { BlogStyledComponent } from "./styledComponents";

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
            flexGrow: 1,
            gap: 4,
          }}
        >
          {user.isAuthenticated && (
            <div>
              <div>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  User Info
                </Typography>

                <p>Name: {user?.name || "N/A"}</p>
                <p>Email: {user?.email || "N/A"}</p>
                <p>Admin: {user.admin ? "Admin" : "not Admin"}</p>
              </div>
            </div>
          )}
          <Posts searchTerm={props.searchTerm} ifMyPosts={ifMyPosts} />
        </Container>
      </BlogStyledComponent>
      <Footer />
    </ThemeProvider>
  );
}

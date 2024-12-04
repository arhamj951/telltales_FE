import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Post from "../Blog/components/Posts/components/Post";
import Typography from "@mui/material/Typography";
import { Container, CssBaseline, ThemeProvider, Button } from "@mui/material";
import { darkTheme } from "../../Theme/theme";
import { useUser } from "../context/UserContext";
import { apiRequest } from "../../services/apiClient";
import { BlogStyledComponent } from "../Blog/styledComponents";
import { Article } from "../../types/types";

export default function AdminDashBoard(props: { searchTerm: string }) {
  const [articleInfo, setArticleInfo] = useState<Article[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );

  const { user } = useUser();

  useEffect(() => {
    getPostsForApproval().then((posts: Article[]) => {
      setArticleInfo(posts);
    });
  }, []);

  const getPostsForApproval = async () => {
    const uid = user._id;
    try {
      const response = await apiRequest("get", `/posts/adminposts/${uid}`, {});
      return response.data.posts;
    } catch (error) {
      console.error("Error during fetching posts for approval:", error);
      return null;
    }
  };
  const updatePostApproval = async (pid: string, approval: string) => {
    let response: any;
    const uid = user._id;
    try {
      response = await apiRequest("patch", `/posts/adminposts/${pid}/${uid}`, {
        Approval: approval,
      });
    } catch (error) {
      console.error("Error during fetching posts for approval", error);
    }
  };

  const approve = (article: any) => {
    updatePostApproval(article._id, "approve").then(() => {
      getPostsForApproval().then((posts: Article[]) => {
        setArticleInfo(posts);
      });
    });
  };

  const disApprove = (article: any) => {
    updatePostApproval(article._id, "disapprove").then(() => {
      getPostsForApproval().then((posts: Article[]) => {
        setArticleInfo(posts);
      });
    });
  };

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };
  let searchedPosts: Article[] = [];
  if (articleInfo) {
    searchedPosts = articleInfo.filter((article) => {
      return (
        article.title
          .toLocaleLowerCase()
          .includes(props.searchTerm.toLowerCase()) ||
        article.tag
          .toLocaleLowerCase()
          .includes(props.searchTerm.toLocaleLowerCase())
      );
    });
  }

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
          <Box>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Admin Panel
            </Typography>
            <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
              {props.searchTerm === "" ? (
                articleInfo &&
                articleInfo.map((article, index) => (
                  <Grid sx={{ mb: 6 }} key={index} item xs={12} sm={6}>
                    <Post
                      article={article}
                      index={index}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                      focusedCardIndex={focusedCardIndex}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => {
                          disApprove(article);
                        }}
                      >
                        Not Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          approve(article);
                        }}
                      >
                        Approve
                      </Button>
                    </Box>
                  </Grid>
                ))
              ) : searchedPosts.length !== 0 ? (
                searchedPosts.map((article, index) => (
                  <Grid key={index} item xs={12} sm={6}>
                    <Post
                      article={article}
                      index={index}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                      focusedCardIndex={focusedCardIndex}
                    />
                  </Grid>
                ))
              ) : (
                <div>no posts found</div>
              )}
            </Grid>
          </Box>
        </Container>
      </BlogStyledComponent>
    </ThemeProvider>
  );
}

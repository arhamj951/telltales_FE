import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material";
import { Styled } from "styled-components";
import Post from "../Blog/components/Posts/components/Post";
import Typography from "@mui/material/Typography";
import {
  Container,
  CssBaseline,
  styled,
  ThemeProvider,
  Button,
} from "@mui/material";
import { darkTheme } from "../../Theme/theme";
import { BlogStyledComponent } from "../Blog";
// import articleInfo from "../../dummyData/articleInfo";
import axios from "axios";

type Author = {
  name: string;
  avatar: string;
};

type Article = {
  _id: string;
  tag: string;
  title: string;
  description: string;
  authors: Author[];
};

export default function AdminDashBoard(props: { searchTerm: string }) {
  const [ifMyPosts, setIfMyPosts] = useState<boolean>(false);
  const [articleInfo, setArticleInfo] = useState<Article[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );

  useEffect(() => {
    getPostsForApproval().then((posts: Article[]) => {
      setArticleInfo(posts);
      console.log("nash", articleInfo);
    });
  }, []);

  const getPostsForApproval = async () => {
    let response: any;
    try {
      response = await axios.get(
        "http://localhost:5000/api/posts/adminposts",
        {}
      );
    } catch (error) {
      console.error("Error during fetching posts for approval", error);
    }

    if (!response) {
      return;
    }
    return response.data.posts;
  };

  const approve = (article: any) => {
    updatePostApproval(article._id, "approve").then(() => {
      console.log(article._id);
      getPostsForApproval().then((posts: Article[]) => {
        setArticleInfo(posts);
        console.log("approve", articleInfo);
      });
    });
  };

  const disApprove = (article: any) => {
    updatePostApproval(article._id, "disapprove").then(() => {
      getPostsForApproval().then((posts: Article[]) => {
        setArticleInfo(posts);
        console.log("disapprove", articleInfo);
      });
    });
  };

  const updatePostApproval = async (pid: string, approval: string) => {
    let response: any;
    try {
      response = await axios.patch(
        `http://localhost:5000/api/posts/adminposts/${pid}`,
        { Approval: approval }
      );
    } catch (error) {
      console.error("Error during fetching posts for approval", error);
    }
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
            flexGrow: 1, // Ensures the content fills available space
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

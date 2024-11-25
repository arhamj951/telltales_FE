import React, { useEffect, useState } from "react";
import { Box, Chip } from "@mui/material";
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
import { useUser } from "../context/UserContext";

type Author = {
  name: string;
  avatar: string;
};

type Article = {
  tag: string;
  title: string;
  description: string;
  Approval?: string;
  authors: Author[];
};

export default function MyPosts(props: { searchTerm: string }) {
  const [ifMyPosts, setIfMyPosts] = useState<boolean>(true);
  const [articleInfo, setArticleInfo] = useState<Article[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );
  const { user } = useUser();

  useEffect(() => {
    getMyPosts().then((posts: Article[]) => {
      setArticleInfo(posts);
      console.log("nash", articleInfo);
    });
  }, []);

  const getMyPosts = async () => {
    let response: any;
    try {
      response = await axios.get(
        `http://localhost:5000/api/posts/user/${user._id}`,
        {}
      );
    } catch (error) {
      console.error("Error during fetching posts for approval", error);
    }
    if (!response) {
      return;
    }
    console.log(response.data.posts);
    return response.data.posts;
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
              My Posts
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
                      ifMyPosts={ifMyPosts}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        mt: 2,
                      }}
                    >
                      <Chip
                        label={
                          <Typography
                            variant="caption"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            {article.Approval}
                          </Typography>
                        }
                        color="primary"
                        sx={{ borderRadius: 4 }}
                      />
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
                      ifMyPosts={ifMyPosts}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {article.Approval}
                      </Typography>
                    </Box>
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

import React, { useEffect, useState } from "react";
import { Box, Chip, colors } from "@mui/material";
import Grid from "@mui/material/Grid";
import Post from "../Blog/components/Posts/components/Post";
import Typography from "@mui/material/Typography";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "../../Theme/theme";
import { useUser } from "../context/UserContext";
import { apiRequest } from "../../services/apiClient";
import { Article } from "../../types/types";
import { BlogStyledComponent } from "../Blog/styledComponents";

const articleStatus = (articleApproval: string | undefined): string => {
  return articleApproval === "approve"
    ? "Approved Post"
    : articleApproval === "disapprove"
    ? "Disapproved Post"
    : "Waiting for approval";
};

const articleStatusColor = (
  articleApproval: string | undefined
): "default" | "success" | "error" | "warning" => {
  return articleApproval === "approve"
    ? "success"
    : articleApproval === "disapprove"
    ? "error"
    : "warning";
};

export default function MyPosts(props: { searchTerm: string }) {
  const [ifMyPosts, setIfMyPosts] = useState<boolean>(true);
  const [articleInfo, setArticleInfo] = useState<Article[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );
  const [refresher, setRefresher] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    getMyPosts().then((posts: Article[]) => {
      setArticleInfo(posts);
      console.log("nash", articleInfo);
    });
  }, [refresher]);

  const getMyPosts = async () => {
    let response: any;
    try {
      response = await apiRequest("get", `/posts/user/${user._id}`, {});
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
                      setRefresher={setRefresher}
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
                            {articleStatus(article.Approval)}
                          </Typography>
                        }
                        color={articleStatusColor(article.Approval)}
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
                      setRefresher={setRefresher}
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
                            {articleStatus(article.Approval)}
                          </Typography>
                        }
                        color={articleStatusColor(article.Approval)}
                        sx={{ borderRadius: 4 }}
                      />
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

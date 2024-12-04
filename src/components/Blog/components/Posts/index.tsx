import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../../services/apiClient";
import { Article } from "../../../../types/types";

export default function Posts(props: {
  searchTerm: string;
  ifMyPosts: boolean;
}) {
  const [articleInfo, setArticleInfo] = useState<Article[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );

  useEffect(() => {
    getPosts().then((posts: Article[]) => {
      if (posts) setArticleInfo(posts);
    });
  }, []);
  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const getPosts = async () => {
    let response: any;
    try {
      response = await apiRequest("get", "/posts/allapprovedposts", {});
    } catch (error) {
      console.error("Error during fetching posts ", error);
    }

    if (!response) {
      return;
    }
    return response.data.posts;
  };

  let searchedPosts: Article[] = [];
  if (articleInfo && articleInfo.length !== 0) {
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
    <div>
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
        Posts
      </Typography>
      <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
        {props.searchTerm === "" ? (
          articleInfo.length === 0 ? (
            <div>no post has been created yes</div>
          ) : (
            articleInfo.map((article, index) => (
              <Grid key={index} item xs={12} sm={6}>
                <Post
                  article={article}
                  index={index}
                  handleFocus={handleFocus}
                  handleBlur={handleBlur}
                  focusedCardIndex={focusedCardIndex}
                  ifMyPosts={props.ifMyPosts}
                />
              </Grid>
            ))
          )
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
    </div>
  );
}

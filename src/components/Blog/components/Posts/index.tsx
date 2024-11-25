import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { NavigateNextRounded, ThumbUp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import axios from "axios";
// import articleInfo from "../../../../dummyData/articleInfo";

type Author = {
  name: string;
  avatar: string;
};

type Article = {
  tag: string;
  title: string;
  description: string;
  authors: Author[];
};

const StyledTypography = styled(Typography)(({ theme }) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: theme.palette.text.secondary,
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  position: "relative",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "1.25rem",
  "&:hover": { cursor: "pointer", color: theme.palette.primary.main },
  "& .arrow": {
    visibility: "hidden",
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
  "&:hover .arrow": {
    visibility: "visible",
    opacity: 0.7,
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "3px",
    borderRadius: "8px",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: 0,
    height: "1px",
    bottom: 0,
    left: 0,
    backgroundColor: `hsla(220, 30%, 10%, 0.8)`,
    opacity: 0.3,
    transition: "width 0.3s ease, opacity 0.3s ease",
  },
  "&:hover::before": {
    width: "100%",
  },
}));

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
      setArticleInfo(posts);
      console.log("not nash", articleInfo);
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
      response = await axios.get(
        "http://localhost:5000/api/posts/allapprovedposts",
        {}
      );
    } catch (error) {
      console.error("Error during fetching posts ", error);
    }

    if (!response) {
      return;
    }
    return response.data.posts;
  };

  const searchedPosts: Article[] = articleInfo.filter((article) => {
    return (
      article.title
        .toLocaleLowerCase()
        .includes(props.searchTerm.toLowerCase()) ||
      article.tag
        .toLocaleLowerCase()
        .includes(props.searchTerm.toLocaleLowerCase())
    );
  });

  return (
    <div>
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
        Posts
      </Typography>
      <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
        {props.searchTerm === "" ? (
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

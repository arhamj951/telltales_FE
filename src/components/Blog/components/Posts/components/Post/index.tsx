import React, { useState } from "react";
import {
  Box,
  Typography,
  AvatarGroup,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { styled } from "@mui/material/styles";
import { ThumbUp } from "@mui/icons-material";
import { useUser } from "../../../../../context/UserContext";
import axios from "axios";
import { apiRequest } from "../../../../../../services/apiClient";
import { TitleTypography } from "./styledComponents";

function Reactions() {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", pt: 1 }}>
      <IconButton>
        <ThumbUp sx={{ fontSize: 20, color: "text.secondary" }} />
      </IconButton>
    </Box>
  );
}

const demoTags = [
  "Technology",
  "Health",
  "Business",
  "Lifestyle",
  "Entertainment",
  "Innovation",
];

function Author({ authors }: { authors: { name: string; avatar: string }[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1.5,
        alignItems: "center",
        justifyContent: "space-between",
        pt: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.2,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={3}>
          {authors?.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 28, height: 28 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption" sx={{ fontWeight: 400 }}>
          {authors && authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        July 14, 2021
      </Typography>
    </Box>
  );
}

export default function Post({
  article,
  index,
  handleFocus,
  handleBlur,
  focusedCardIndex,
  ifMyPosts,
  setRefresher,
}: any) {
  let refresh: boolean = true;
  const [openModal, setOpenModal] = useState(false);
  const [editedArticle, setEditedArticle] = useState(article);
  const { user } = useUser();

  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => setOpenModal(false);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedArticle({
      ...editedArticle,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTag = (event: any) => {
    setEditedArticle({
      ...editedArticle,
      tag: event.target.value as string,
    });
  };

  const handleSave = async () => {
    let response: any;
    let pid = article._id;
    let uid = user._id;
    try {
      response = await apiRequest("patch", `/posts/update/${pid}/${uid}`, {
        title: editedArticle.title,
        description: editedArticle.description,
        tag: editedArticle.tag,
      });
    } catch (error) {
      console.error("Error during updating the post", error);
    }
    console.log("Saved edited article:", editedArticle);
    handleModalClose();
    setRefresher((prev: boolean) => !prev);
  };

  const handleDeletePost = async () => {
    let response: any;
    let pid = article._id;
    let uid = user._id;
    try {
      response = await apiRequest("delete", `/posts/delete/${pid}/${uid}`, {});
    } catch (error) {
      console.error("Error during updating the post", error);
    }
    setRefresher((prev: boolean) => !prev);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
          height: "100%",
          padding: 2,
          borderRadius: "12px",
          backgroundColor: "background.paper",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography
          gutterBottom
          variant="caption"
          component="div"
          sx={{ color: "primary.main", fontWeight: 500 }}
        >
          {article.tag}
        </Typography>
        <TitleTypography
          gutterBottom
          variant="h6"
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          tabIndex={0}
        >
          {article.title}
          <NavigateNextRoundedIcon
            className="arrow"
            sx={{ fontSize: "1rem", color: "primary.main" }}
          />
        </TitleTypography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {article.description}
        </Typography>
        <Reactions />
        <Author authors={article.authors} />
        {ifMyPosts && (
          <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleDeletePost}
            >
              Delete Post
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleModalOpen}
            >
              Edit
            </Button>
          </Box>
        )}
      </Box>
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={editedArticle.title}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={editedArticle.description}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <InputLabel id="tag-label" sx={{ mt: 2 }}>
            Tag
          </InputLabel>
          <Select
            labelId="tag-label"
            id="tag-select"
            value={editedArticle.tag}
            onChange={handleChangeTag}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
              mt: 1,
            }}
          >
            {demoTags.map((tag, index) => (
              <MenuItem key={index} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

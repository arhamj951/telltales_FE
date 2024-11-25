import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import articleInfo from "../../../../../../dummyData/articleInfo";
import { useUser } from "../../../../../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const defaultPostData = {
  title: "",
  description: "",
  tag: "",
  authors: [{ name: "", avatar: "" }],
};

interface PostFormProps {
  isEditMode?: boolean;
  postData?: {
    title: string;
    description: string;
    tag: string;
    authors: { name: string; avatar: string }[];
  };
  onSubmit?: (postData: typeof defaultPostData) => void;
}

const demoTags = [
  "Technology",
  "Health",
  "Business",
  "Lifestyle",
  "Entertainment",
];

const BlogStyledComponent = styled("div")(({ theme }) => ({
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
  },
}));

const PostForm: React.FC<PostFormProps> = ({
  isEditMode,
  postData = defaultPostData,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(postData);
  // const [articles, setArticles] = useState(articleInfo);
  const { user } = useUser();

  const [error, setError] = useState({
    title: false,
    description: false,
    tag: false,
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData(postData);
    }
  }, [isEditMode, postData]);

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const { name, value } = e.target;

    if (name === "authorname") {
      setFormData((prevState) => ({
        ...prevState,
        authors: [{ ...prevState.authors[0], name: value }],
      }));
    } else if (name === "authoravatar") {
      setFormData((prevState) => ({
        ...prevState,
        authors: [{ ...prevState.authors[0], avatar: value }],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name as string]: value,
      }));
    }
  };

  const handleChangeTag = (event: any) => {
    setFormData({
      ...formData,
      tag: event.target.value as string,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
    // Validate form
    const newError = {
      title: formData.title.trim() === "",
      description: formData.description.trim() === "",
      tag: formData.tag === "",
    };

    setError(newError);

    // If there's any error, don't submit the form
    if (Object.values(newError).includes(true)) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts/createpost",
        {
          title: formData.title,
          description: formData.description,
          tag: formData.tag,
          creator: user._id,
        }
      );

      navigate("/blog");
      alert("Post created successfully!");
    } catch (error) {
      alert("failed. Please try again.");
      console.error("Error", error);
    }
    // setArticles((prevArticles) => [...prevArticles, formData]);

    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Form Submitted:", formData);
    }
  };

  return (
    <BlogStyledComponent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          borderRadius: 2,
          backgroundColor: "background.paper",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography variant="h5" gutterBottom>
          {isEditMode ? "Edit Post" : "Create New Post"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={error.title}
            helperText={error.title ? "Title is required" : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          {/* Description Field */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={error.description}
            helperText={error.description ? "Description is required" : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <FormControl fullWidth margin="normal" error={error.tag}>
            <InputLabel id="tag-label">Tag</InputLabel>
            <Select
              labelId="tag-label"
              id="tag-select"
              value={formData.tag}
              label="Tag"
              onChange={handleChangeTag}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              {demoTags.map((tag, index) => (
                <MenuItem key={index} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
            {error.tag && <FormHelperText>Tag is required</FormHelperText>}
          </FormControl>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained">
              {isEditMode ? "Update Post" : "Create Post"}
            </Button>
          </Box>
        </form>
      </Box>
    </BlogStyledComponent>
  );
};

export default PostForm;

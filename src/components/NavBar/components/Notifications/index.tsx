import React, { useState, useEffect } from "react";
import MuiCard from "@mui/material/Card";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

export interface Alert {
  _id: string;
  title: string;
  description: string;
  creator: string;
}

interface NotificationsProps {
  alerts: Alert[];
}

export default function Notifications({ alerts }: NotificationsProps) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {alerts.map((alert) => (
        <ListItem
          key={alert._id}
          secondaryAction={
            <IconButton aria-label="comment">
              <CommentIcon />
            </IconButton>
          }
        >
          <ListItemText primary={alert.title} secondary={alert.description} />
        </ListItem>
      ))}
    </List>
  );
}

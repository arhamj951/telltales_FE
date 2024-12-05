import React from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { Alert } from "../../../../types/types";
import { apiRequest } from "../../../../services/apiClient";

interface NotificationsProps {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
}

export default function Notifications({
  alerts,
  setAlerts,
}: NotificationsProps) {
  const handleItemClick = async (alertId: string) => {
    try {
      // API request to mark the notification as read
      await apiRequest("post", `/alerts/updatealert/${alertId}`, {});

      // Update state with the new 'read' status
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert._id === alertId ? { ...alert, read: true } : alert
        )
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          maxHeight: 500,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        {alerts.map((alert) => (
          <ListItem
            key={alert._id}
            component="button"
            onClick={() => handleItemClick(alert._id)}
            sx={{
              cursor: "pointer",
              textAlign: "left",
              border: "none",
              padding: 1,
              bgcolor: alert.read ? "rgba(0, 0, 175, 0.5)" : "background.paper",
              color: alert.read ? "white" : "inherit",
              "&:hover": {
                backgroundColor: alert.read
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(0, 0, 175, 0.2)",
              },
            }}
          >
            <ListItemText primary={alert.title} secondary={alert.description} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

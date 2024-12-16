import React, { useState } from "react";
import { Card, IconButton, Typography, Box } from "@mui/material";
import { Delete, GroupAdd } from "@mui/icons-material";
import DeleteDialog from "../deletedialogpopup/DeleteDialog";

const ChannelCard = ({ title, onClick, onDelete, onAddMember, user }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleOpenDeleteDialog = (e) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(); // Call the passed onDelete function
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          cursor: "pointer",
          width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          justifyContent: "space-between",
          backgroundColor: "rgba(24, 111, 101, 0.1)",
          boxShadow: 0,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          },
        }}
        onClick={onClick}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box>
          {user.user_type !== "STUDENT" && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onAddMember();
              }}
              sx={{
                color: "rgba(0, 0, 0, 0.54)",
                "&:hover": {
                  color: "#187569",
                },
              }}
            >
              <GroupAdd />
            </IconButton>
          )}

          {user.user_type !== "STUDENT" && (
            <IconButton
              onClick={handleOpenDeleteDialog}
              sx={{
                color: "rgba(0, 0, 0, 0.54)",
                "&:hover": {
                  color: "#d32f2f",
                },
              }}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      </Card>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleConfirmDelete}
        content={
          <>
            Are you sure you want to delete this channel:  <strong>{title}</strong>?
          </>
        }
        isDeleting={false} 
      />
    </>
  );
};

export default ChannelCard;

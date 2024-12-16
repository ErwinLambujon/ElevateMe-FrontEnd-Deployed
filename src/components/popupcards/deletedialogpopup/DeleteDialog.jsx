import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

const DeleteDialog = ({ open, onClose, onDelete, content, isDeleting }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4,
                    textAlign: 'center',
                }}
            >
                <Typography id="delete-dialog-title" variant="h6" gutterBottom>
                    Confirm Delete
                </Typography>
                <Typography variant="body1" gutterBottom>
                   {content}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            borderRadius: 4,
                            backgroundColor: "#186F65", // Fill color for Cancel button
                            color: "white", // Text color
                            '&:hover': {
                                backgroundColor: "#155B54", // Darker shade on hover
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onDelete}
                        variant="contained"
                        disabled={isDeleting}
                        sx={{
                            borderRadius: 4,
                            backgroundColor: "rgba(211, 47, 47, 0.8)", // Fade red
                            color: "white",
                            '&:hover': {
                                backgroundColor: "rgba(211, 47, 47, 1)", // Darker red on hover
                            },
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteDialog;

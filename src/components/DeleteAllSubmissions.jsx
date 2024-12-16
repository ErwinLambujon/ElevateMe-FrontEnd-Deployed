import React from 'react';
import { Box, Button, LinearProgress, Typography, Modal, } from '@mui/material';

import axiosInstance from '../helpers/axios';

const DeleteAllSubmissions = ({ setPosts, channelId, onDeleteFetch }) => {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [progress, setProgress] = React.useState(0);


  const handleClickOpen = () => {
    setOpen(true);
    setError(null);
    setProgress(0);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setProgress(0);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
  
      const response = await axiosInstance.get(`/api/channels/${channelId}/submissions/`);
      const submissions = response.data;
      const totalSubmissions = submissions.length;
  
      if (totalSubmissions === 0) {
        setPosts([]);
        onDeleteFetch();
        handleClose();
        return;
      }
  
      const deleteRequests = submissions.map((submission, index) =>
        axiosInstance.delete(`/api/channels/${channelId}/submissions/${submission.id}/`).then(() => {
          setProgress(Math.round(((index + 1) / totalSubmissions) * 100));
        })
      );
  
      await Promise.all(deleteRequests);
  
      setPosts([]);
      onDeleteFetch();
      handleClose();
    } catch (err) {
      setError("Failed to delete submissions. Please try again.");
      console.error("Error deleting submissions:");
    } finally {
      setIsDeleting(false);
    }
  };
  

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleClickOpen}
        disabled={isDeleting}
        sx={{
          borderRadius: '20px',
          padding: '8px 16px',
          backgroundColor: '#D32F2F',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#B71C1C',
          },
          '&:disabled': {
            backgroundColor: '#E57373',
          },
        }}
      >
        {isDeleting ? "Deleting..." : "Delete All"}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
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
            borderRadius: 10,
            textAlign: 'center',
          }}
        >
          <Typography id="delete-modal-title" variant="h6" gutterBottom>
            Are you absolutely sure?
          </Typography>
          <Typography id="delete-modal-description" sx={{ mt: 2 }}>
            This action cannot be undone. This will permanently delete all submissions from this channel.
          </Typography>

          {isDeleting && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} color="error" />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {progress}% Complete
              </Typography>
            </Box>
          )}

          {error && (
            <Typography variant="body2" sx={{ mt: 2, color: '#D32F2F' }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                borderRadius: 4,
                backgroundColor: "#186F65",
                color: "white",
                '&:hover': {
                  backgroundColor: "#155B54",
                },
                mr: 2,
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={isDeleting}
              sx={{
                borderRadius: 4,
                backgroundColor: "rgba(211, 47, 47, 0.8)",
                color: "white",
                '&:hover': {
                  backgroundColor: "rgba(211, 47, 47, 1)",
                },
              }}
            >
              {isDeleting ? `Deleting (${progress}%)...` : "Delete All"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteAllSubmissions;

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Slider,
  Button,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from '../../../helpers/constant';
import axiosInstance from '../../../helpers/axios';

const VotingDialog = ({
  open,
  onClose,
  channelId,
  submissionId,
  onVoteSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsSubmitting(true);
      setError(null);

      await axiosInstance.post(
        `/api/channels/${channelId}/submissions/${submissionId}/voting_marks/`,
        {
          marks: rating,
          submission_id: submissionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      onClose();
      onVoteSuccess(); // Call to refresh the rankings
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting your rating."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Rate This File Post
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Rate from 1 (Poor) to 10 (Excellent)
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              1
            </Typography>
            <Typography variant="body2" color="text.secondary">
              10
            </Typography>
          </Box>
          <Slider
            value={rating}
            onChange={handleRatingChange}
            min={1}
            max={10}
            step={1}
            valueLabelDisplay="off"
            sx={{ width: "80%" }}
            disabled={isSubmitting}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Rating: {rating}
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#186F65",
            color: "white",
            borderRadius: 4,
            "&:disabled": {
              backgroundColor: "#186F65",
              opacity: 0.7,
            },
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default VotingDialog;

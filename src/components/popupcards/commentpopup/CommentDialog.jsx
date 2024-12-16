import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

const CommentDialog = ({
  open,
  onClose,
  comments,
  onAddComment,
  loading,
  error,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      setSubmitting(true);
      const success = await onAddComment(newComment);
      if (success) {
        setNewComment("");
      }
      setIsTyping(false);
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "";
      }
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
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
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Comments
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={24} />
              <Typography>Loading comments...</Typography>
            </Box>
          ) : comments.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          ) : (
            comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {comment.author_full_name}
                </Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  {comment.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(comment.commented_on)}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Write a comment..."
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setIsTyping(true);
            }}
            onKeyPress={handleKeyPress}
            onBlur={() => setIsTyping(false)}
            multiline
            rows={isTyping ? 2 : 1}
            disabled={submitting}
            sx={{
              borderRadius: 10,
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#186F65",
                },
                "&:hover fieldset": {
                  borderColor: "#186F65",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#186F65",
                },
              },
            }}
          />
          <Button
            onClick={handleAddComment}
            variant="contained"
            disabled={!newComment.trim() || submitting}
            sx={{
              backgroundColor: "#186F65",
              color: "white",
              minWidth: 40,
              borderRadius: 4,
              marginLeft: 1,
              "&:hover": {
                backgroundColor: "#125B52",
              },
            }}
          >
            {submitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;

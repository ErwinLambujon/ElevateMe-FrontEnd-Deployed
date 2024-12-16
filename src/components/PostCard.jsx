import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import CommentDialog from "../components/popupcards/commentpopup/CommentDialog";
import VotingDialog from "../components/popupcards/votingpopup/VotingDialog";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ViewFilepopup from "./popupcards/viewFilepopup/ViewFilepopup";
import { pdfjs } from "react-pdf";
import DeleteSubmission from "../components/DeleteSubmission";
import axiosInstance from '../helpers/axios';



pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PostCard = ({
  authorId,
  user,
  author,
  content,
  submittedWork,
  channelId,
  onVoteSuccess,
  onDeleteSuccess,
  onDeleteFetch,
}) => {
  const [openVoteDialog, setOpenVoteDialog] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState("");
  const [presignedUrl, setPresignedUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfViewerError, setPdfViewerError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [submission, setSubmissions] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [iserror, setisError] = useState(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      iserror(null);

      const url = `/api/channels/${channelId}/submissions/${submittedWork.id}/`;
      const response = await axiosInstance.delete(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 204) {
        if (onDeleteSuccess) {
          onDeleteSuccess(submittedWork.id);
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Failed to delete submission. Please try again.";
      setisError(errorMessage);
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSuccess = (deletedSubmissionId) => {
    if (onDeleteSuccess) {
      onDeleteSuccess(deletedSubmissionId);
    }
  };
  const getAuthorDisplayName = () => {
    if (typeof author === "string") return author;
    if (author?.first_name && author?.last_name) {
      return `${author.first_name} ${author.last_name}`;
    }
    return "Unknown Author";
  };

  const getAuthorInitial = () => {
    const displayName = getAuthorDisplayName();
    return displayName.charAt(0) || "U";
  };


  useEffect(() => {
    const fetchPresignedUrl = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/presigned-url/${submittedWork.id}/`
        );
        setPresignedUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching presigned URL:", error);
      }
    };

    if (submittedWork.file_url) {
      setPresignedUrl(submittedWork.file_url);
    } else {
      fetchPresignedUrl();
    }
  }, [submittedWork.id, submittedWork.file_url]);

  const handleFileOpen = () => {
    setShowPdfViewer(true);
  };

  const handlePdfViewerError = (error) => {
    setPdfViewerError(error);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleVoteDialogOpen = () => {
    setOpenVoteDialog(true);
  };

  const handleVoteDialogClose = () => {
    setOpenVoteDialog(false);
  };

  const handleCommentDialogOpen = () => {
    setOpenCommentDialog(true);
    fetchComments();
  };

  const handleCommentDialogClose = () => {
    setOpenCommentDialog(false);
  };

  const handleFileDialogOpen = () => {
    setOpenFileDialog(true);
  };

  const handleFileDialogClose = () => {
    setOpenFileDialog(false);
    if (fileUrl) {
      window.URL.revokeObjectURL(fileUrl);
      setFileUrl(null);
    }
  };

  const fetchComments = async () => {
    if (!channelId || !submittedWork?.id) {
      setError("Unable to load comments: Missing channel or submission ID");
      return;
    }

    setLoadingComments(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/api/channels/${channelId}/submissions/${submittedWork.id}/comments/`
      );

      let commentsData = [];
      if (Array.isArray(response.data)) {
        commentsData = response.data;
      } else if (
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        commentsData = response.data.results;
      }

      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError(
        error.response?.data?.detail ||
        "Unable to load comments. Please try again later."
      );
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (commentContent) => {
    if (!channelId || !submittedWork?.id || !commentContent.trim()) {
      return false;
    }

    setLoadingComments(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/api/channels/${channelId}/submissions/${submittedWork.id}/comments/`,
        {
          content: commentContent.trim(),
          submission_id: submittedWork.id,
        }
      );

      await fetchComments();
      return true;
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError(
        error.response?.data?.detail ||
        "Failed to post comment. Please try again."
      );
      return false;
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderRadius: 4,
          boxShadow: 2,
          mb: 2,
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center", marginTop: "-10px" }}>
              <Avatar sx={{ marginRight: 2, backgroundColor: '#67A099 ', fontWeight: "bold" }}>
                {getAuthorInitial()}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {getAuthorDisplayName()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left", fontWeight: 'medium' }}>
                {content}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "-20px",
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="text"
                  onClick={handleCommentDialogOpen}
                  startIcon={<ChatBubbleOutlineIcon />}
                >
                  Comment
                </Button>

                {user.id !== authorId && (
                  <Button
                    variant="text"
                    open={openVoteDialog}
                    onClick={handleVoteDialogOpen}
                    startIcon={<ThumbUpOutlinedIcon onClose={handleVoteDialogClose} />}
                  >
                    Vote
                  </Button>
                )}

                <ViewFilepopup presignedUrl={presignedUrl} />
              </Box>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", alignItems: "right" , marginLeft: 10}}>
                {user.user_type === "TEACHER" && (
                  <DeleteSubmission
                    channelId={Number(channelId)}
                    submissionId={submittedWork.id}
                    onDelete={handleDeleteSuccess}
                    onDeleteFetch={onDeleteFetch}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>


      <CommentDialog
        open={openCommentDialog}
        onClose={handleCommentDialogClose}
        comments={comments}
        onAddComment={handleAddComment}
        loading={loadingComments}
        error={error}
      />
      <VotingDialog
        open={openVoteDialog}
        onClose={handleVoteDialogClose}
        channelId={channelId}
        submissionId={submittedWork.id}
        onVoteSuccess={onVoteSuccess}
      />

      <Dialog
        open={openFileDialog}
        onClose={handleFileDialogClose}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Submitted File
          </Typography>
          {fileUrl ? (
            <iframe
              src={fileUrl}
              title="Submitted Work"
              style={{ width: "100%", height: "500px", border: "none" }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No file available to view.
            </Typography>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default PostCard;

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete,
  ContentCopy,
  GroupAdd,
  MoreHoriz,
  People,
} from "@mui/icons-material";
import SampleImage from "../res/sampleImage.jpg";
import axiosInstance from '../helpers/axios';
import { useState, useEffect } from "react";
import DeleteDialog from "./popupcards/deletedialogpopup/DeleteDialog";
import ChannelListPopup from "./popupcards/channelListPopUp/ChannelListPopUp.jsx";
import AddMemberPopup from "./popupcards/addmemberpopup/RoomMembersPopup";
import { API_BASE_URL } from '../helpers/constant';

const RoomCards = ({ title, roomCode, ownerId, roomId, onDelete, user }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openChannelList, setOpenChannelList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [channelList, setChannelList] = useState([]);
  const [openAddMemberPopup, setOpenAddMemberPopup] = useState(false);
  const [ownerName, setOwnerName] = useState("unknown");

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");



  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        let token = localStorage.getItem("token");
        const response = await axiosInstance.get(
          `/api/user/${ownerId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const { first_name, last_name } = response.data;
        setOwnerName(`${first_name} ${last_name}`);
      } catch (error) {
        console.error("Error fetching owner's name:", error);
      }
    };

    if (ownerId) {
      fetchOwnerName();
    }
  }, [ownerId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      let token = localStorage.getItem("token");

      await axiosInstance.delete(`/api/rooms/${roomId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      onDelete(roomId);
      setOpenDeleteDialog(false);
      // Show success snackbar
      setSnackbarMessage("Room deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting room:", error);
      // Show error snackbar
      setSnackbarMessage("Error deleting room.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyRoomCode = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(roomCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      // Show success snackbar for copying room code
      setSnackbarMessage("Room code copied to clipboard!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to copy room code:", error);
      // Show error snackbar
      setSnackbarMessage("Failed to copy room code.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleShowChannelList = () => {
    setChannelList([
      { id: 1, title: "Channel 1" },
      { id: 2, title: "Channel 2" },
    ]); // Example channel list with IDs
    setOpenChannelList(true);
  };

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: "16px",
        boxShadow: 3,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardMedia component="img" height="160" image={SampleImage} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>

        {user.user_type === "STUDENT" && ownerName && (
          <Typography variant="body2" color="textSecondary">
            <span style={{ fontSize: "0.8rem" }}>Creator: </span>{" "}
            <span style={{ fontWeight: "bold" }}>{ownerName}</span>
          </Typography>
        )}
      </CardContent>

      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tooltip title="Options">
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
              borderRadius: "50%",


            }}
          >
            <IconButton
              onClick={() => setShowOptions(!showOptions)}
              sx={{ color: "white" }}
            >
              <MoreHoriz />
            </IconButton>
          </Box>
        </Tooltip>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 50,
          right: showOptions ? 50 : 8,
          display: "flex",
          gap: 1,
          transition: "right 0.3s ease",
          justifyContent: "center",
          left: 0,
          right: 0,
        }}
      >
        {showOptions && (
          <>
            <Tooltip title="Show Channel List">
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
                  borderRadius: "50%",

                }}
              >
                <IconButton onClick={handleShowChannelList} sx={{ color: "white" }}>
                  <People />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip title="Copy Room Code">
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
                  borderRadius: "50%",

                }}
              >
                <IconButton onClick={handleCopyRoomCode} sx={{ color: "white" }}>
                  <ContentCopy />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip title="Members">
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
                  borderRadius: "50%",

                }}
              >
                <IconButton
                  onClick={() => setOpenAddMemberPopup(true)}
                  sx={{ color: "white" }}
                >
                  <GroupAdd />
                </IconButton>
              </Box>
            </Tooltip>
            {user.user_type !== "STUDENT" && (
              <Tooltip title="Delete Room">
                <Box
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent background
                    borderRadius: "50%",
                    padding: "1px",
                  }}
                >
                  <IconButton
                    onClick={() => setOpenDeleteDialog(true)}
                    sx={{ color: "white" }}
                    disabled={isDeleting}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Tooltip>
            )}
          </>
        )}
      </Box>

      {isCopied && (
        <Typography
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          Room code copied!
        </Typography>
      )}
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDelete}
        content={
          <>
            Are you sure you want to delete this room: <span style={{ fontWeight: 'bold' }}>{title}</span>?
          </>
        } 
        isDeleting={isDeleting}
      />
      <ChannelListPopup
        open={openChannelList}
        onClose={() => setOpenChannelList(false)}
        roomId={roomId}
        //onAddChannel={() => console.log("Add new channel logic goes here.")}
        user={user}
      />

      <AddMemberPopup
        open={openAddMemberPopup}
        onClose={() => setOpenAddMemberPopup(false)}
        roomId={roomId}
        user={user}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default RoomCards;

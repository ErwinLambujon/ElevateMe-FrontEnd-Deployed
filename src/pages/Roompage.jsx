import { Box, Button, Grid, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import GridBackground from "../res/gridbackground.png";
import RoomCard from "../components/RoomCards";
import JoinRoomPopup from "../components/popupcards/JoinRoomPopUp/JoinRoomPopUp";
import CreateRoomPopup from "../components/popupcards/createroompopup/CreateRoomPopUp";
import ChannelListPopup from "../components/popupcards/channelListPopUp/ChannelListPopUp.jsx";
import { useState, useEffect } from "react";
import { API_BASE_URL } from '../helpers/constant';
import axiosInstance from '../helpers/axios';
import { Room } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // For navigation



const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreateRoomPopupOpen, setIsCreateRoomPopupOpen] = useState(false);
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomChannels, setRoomChannels] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [user, setCurrentlyLoginId] = useState({
    id: "",
    
    email: "",
    first_name: "",
    last_name: "",
    user_type: "",
  });

  useEffect(() => {
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const userResponse = await axiosInstance.get(
          `/api/user/get_currently_login/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setCurrentlyLoginId(userResponse.data);

        await fetchRooms(); // Call fetchRooms here
      } catch (error) {
        console.error("Error fetching rooms or user:", error);
        if (error.response && error.response.status === 401) {
          console.error(
            "Unauthorized: Check if the token is valid and correctly formatted."
          );
        }
      }
    };

    fetchCurrentlyLoggedInUser();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const roomsResponse = await axiosInstance.get(
        `/api/rooms/auth_rooms/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setRooms([...roomsResponse.data]);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      if (error.response && error.response.status === 401) {
        console.error(
          "Unauthorized: Check if the token is valid and correctly formatted."
        );
      }
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  const handleRoomJoined = async () => {
    await fetchRooms(); 
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleOpenCreateRoomPopup = () => {
    setIsCreateRoomPopupOpen(true);
  };

  const handleCloseCreateRoomPopup = () => {
    setIsCreateRoomPopupOpen(false);
  };

  const handleDeleteRoom = (deletedRoomId) => {
    setRooms((prevRooms) =>
      prevRooms.filter((room) => room.id !== deletedRoomId)
    );
  };

  const handleRoomCreated = (room) => {
    setRooms((prevRooms) => [
      ...prevRooms,
      {
        id: room.id,
        room_name: room.room_name,
        room_code: room.room_code,
        room_owner_Id: room.room_owner_id,
        channels: [],
      },
    ]);
    setShowSuccess(true);
    handleCloseCreateRoomPopup();
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleOpenChannelList = (room) => {
    setSelectedRoom(room);
    setIsChannelListOpen(true);
  };

  const handleCloseChannelList = () => {
    setIsChannelListOpen(false);
  };

  const handleAddChannel = (roomId) => {
    const newChannel = {
      title: `Channel ${roomChannels[roomId]?.length + 1 || 1}`,
    };
    setRoomChannels((prevChannels) => ({
      ...prevChannels,
      [roomId]: [...(prevChannels[roomId] || []), newChannel],
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${GridBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: 1,
      }}
    >
      <Typography
        variant="h1"
        fontSize="50px"
        gutterBottom
        sx={{ marginTop: "5px" }}
      >
        Room Page
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="flex-start"
        alignItems="center"
        sx={{
          maxWidth: "1450px",
          margin: "20px auto",
          padding: "0 16px",
          px: { xs: "16px", sm: "50px", md: "100px" },
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          {user.user_type === "STUDENT" && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenPopup}
              sx={{
                borderRadius: 4,
                backgroundColor: "#186F65",
                color: "white",
                minWidth: "150px",
              }}
            >
              Join Room
            </Button>
          )}

          {user.user_type === "TEACHER" && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateRoomPopup}
              sx={{
                marginLeft: 2,
                borderRadius: 4,
                backgroundColor: "#186F65",
                color: "white",
                minWidth: "150px",
              }}
            >
              Create Room
            </Button>
          )}
        </Grid>

        {loading ? ( // Show loading spinner while loading
          <Grid item xs={12} display="flex" justifyContent="center">
            <CircularProgress color="primary" />
          </Grid>
        ) : (
          rooms.map((room) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={room.room_id}
              onClick={() => handleOpenChannelList(room)}
            >
              <RoomCard
                title={room.room_name}
                roomCode={room.room_code}
                ownerId={room.room_owner_id}
                roomId={room.id}
                onDelete={handleDeleteRoom}
                user={user}
              />
            </Grid>
          ))
        )}
      </Grid>

      <JoinRoomPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        onJoin={handleRoomJoined}
        user={user}
      />

      <CreateRoomPopup
        open={isCreateRoomPopupOpen}
        onClose={handleCloseCreateRoomPopup}
        onRoomCreated={handleRoomCreated}
      />

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Room created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoomPage;

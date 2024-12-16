import { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from '../../../helpers/constant';
import axiosInstance from '../../../helpers/axios';


const JoinRoomPopup = ({ open, onClose, onJoin, user }) => {
    const [roomCode, setRoomCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (open) {
            setRoomCode("");
            setErrorMessage("");
        }
    }, [open]);

    const handleJoinRoom = async () => {
        if (!roomCode) {
            setErrorMessage("Room code is required.");
            setShowError(true);
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token is missing. Please log in.");
            }

            await axiosInstance.post(
                `/api/rooms/join/`,
                { room_code: roomCode },
                { headers: { Authorization: `Token ${token}` } }
            );

            setShowSuccess(true);
            onJoin(); 
            onClose();
        } catch (error) {
            console.error("Error joining room:", error);
            setErrorMessage(
                error.response?.data?.detail || "Failed to join the room."
            );
            setShowError(true);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="join-room-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography id="join-room-title" variant="h6" component="h2" gutterBottom>
                        Join Room Code
                    </Typography>

                    <TextField
                        fullWidth
                        label="Room Code"
                        variant="outlined"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleJoinRoom}
                        sx={{
                            borderRadius: 8,
                            px: 4,
                        }}
                    >
                        Join
                    </Button>
                </Box>
            </Modal>

            <Snackbar
                open={showError}
                autoHideDuration={3000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setShowError(false)}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setShowSuccess(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Request to join the room was submitted successfully.
                </Alert>
            </Snackbar>
        </>
    );
};

export default JoinRoomPopup;

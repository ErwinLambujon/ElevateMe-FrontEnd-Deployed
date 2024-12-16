import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import axiosInstance from '../../../helpers/axios';
import MembersList from "./MembersList";
import AddMember from "./AddMember";
import { API_BASE_URL } from '../../../helpers/constant';


const AddMemberPopup = ({ open, onClose, roomId, user}) => {
    const [currentPage, setCurrentPage] = useState("members"); 
    const [emailDatabase, setEmailDatabase] = useState([]);
    const [members, setMembers] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axiosInstance.get(`/api/user/`);
                const emails = response.data.map((user) => user.email);
                setEmailDatabase(emails);
            } catch (error) {
                console.error("Failed to fetch emails:", error);
            }
        };

        fetchEmails();
    }, []);
   
    

    const handleAddMembers = async (addedEmails) => {
             try {
        let token = localStorage.getItem("token");

            const payload = { new_room_members: addedEmails };
            const response = await axiosInstance.patch(
                `/api/rooms/${roomId}/`,
                payload,
                { headers: { Authorization: `Token ${token}` } }
            );

            if (response.status === 201) {
                setSnackbar({
                    open: true,
                    message: "Successfully added to the room",
                    severity: "success",
                });

                setCurrentPage("members"); 
            }
        } catch (error) {
            let errorMessage = "An error occurred";
            if (error.response && error.response.status === 400) {
                errorMessage = "The member might already be in the room";
            }
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error",
            });
        }
    };
    

   

    const handleBackToMembers = () => {
        setCurrentPage("members");
    };

    const handleAddMembersPage = () => {
        setCurrentPage("addMember");
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="add-member-title"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: 500,
                    height: 650,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4,
                }}
            >
                {currentPage === "members" ? (
                    <MembersList
                        members={members}
                        onAddMembers={handleAddMembersPage}
                        roomId={roomId}
                        onClose={onClose}
                        user={user}
                    />
                ) : (
                    <AddMember
                        emailDatabase={emailDatabase}
                        onSubmit={handleAddMembers}
                        onBack={handleBackToMembers}
                        roomId={roomId}
                    />
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal>
    );
};

export default AddMemberPopup;

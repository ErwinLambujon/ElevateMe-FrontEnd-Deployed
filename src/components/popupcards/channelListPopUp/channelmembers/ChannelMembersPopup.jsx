import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import axiosInstance from '../../../../helpers/axios';
import MembersList from "./MemberListChannel";
import AddMember from "./AddMemberChannel";
import { API_BASE_URL } from '../../../../helpers/constant';


const ChannelMembersPopup = ({ open, onClose, roomId, user, channelId }) => {
    const [currentPage, setCurrentPage] = useState("members"); 
    const [emailDatabase, setEmailDatabase] = useState([]);
    const [members, setMembers] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [roomMembers, setRoomMembers] = useState([]);
    

    useEffect(() => {
        const fetchRoomMembers = async () => {
            try {
                let token = localStorage.getItem("token");
                const response = await axiosInstance.get(`/api/rooms/${roomId}/members/`,  { headers: { Authorization: `Token ${token}` } });
                const roomMemberIds = response.data.map((member) => member.member_id);

                const memberDetails = await Promise.all(
                    roomMemberIds.map((memberId) => axiosInstance.get(`/api/user/${memberId}/`,  { headers: { Authorization: `Token ${token}` } }))
                );

                
                const emails = memberDetails.map((res) => res.data.email);
                setRoomMembers(emails);
                setEmailDatabase(emails); 
            } catch (error) {
                console.error("Failed to fetch room members:", error);
            }
        };
        fetchRoomMembers();
    }, [roomId]);

    const handleAddMembers = async (addedEmails) => {
        try {
            let token = localStorage.getItem("token");
            

            const invalidEmails = addedEmails.filter(email => !roomMembers.includes(email));
            
            if (invalidEmails.length > 0) {
                setSnackbar({
                    open: true,
                    message: `The following emails are not part of the room: ${invalidEmails.join(", ")}`,
                    severity: "error",
                });
                return;
            }
            
            const payload = { new_channel_member_emails: addedEmails, room_id: roomId };
            const response = await axiosInstance.patch(
                `/api/channels/${channelId}/`,
                payload,
                { headers: { Authorization: `Token ${token}` } }
            );
    
            if (response.status === 201) {
                setSnackbar({
                    open: true,
                    message: "Successfully added to the channel",
                    severity: "success",
                });
    
                setCurrentPage("members"); 
            }
        } catch (error) {
            let errorMessage = "An error occurred";
            if (error.response && error.response.status === 400) {
                errorMessage = "The member might already be in the channel";
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
                    height: 500,
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
                        channelId={channelId}
                    />
                ) : (
                    <AddMember
                        emailDatabase={roomMembers}
                        onSubmit={handleAddMembers}
                        onBack={handleBackToMembers}
                        channelId= {channelId}
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

export default ChannelMembersPopup;

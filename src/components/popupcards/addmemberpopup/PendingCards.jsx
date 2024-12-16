import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Button, Typography, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../helpers/axios';
import { API_BASE_URL } from '../../../helpers/constant';


const PendingCards = ({ roomId, onAccept }) => {
    const [pendingMembers, setPendingMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingMembers = async () => {
            let token = localStorage.getItem("token");

            if (!token) {
                setError("No token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/api/rooms/${roomId}/applicants/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                const pendingApplicants = response.data.filter(applicant => applicant.status === "pending");

                const applicantsWithUserData = await Promise.all(
                    pendingApplicants.map(async (applicant) => {
                        try {
                            const userResponse = await axiosInstance.get(`/api/user/${applicant.user}`, {
                                headers: {
                                    Authorization: `Token ${token}`,
                                },
                            });
                            return { ...applicant, email: userResponse.data.email };
                        } catch (userError) {
                            console.error("Error fetching user data:", userError);
                            return { ...applicant, email: "Unknown" };
                        }
                    })
                );

                setPendingMembers(applicantsWithUserData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingMembers();
    }, [roomId]);

    const handleAction = async (requestId, action) => {
        let token = localStorage.getItem("token");

        try {
            await axiosInstance.post(
                `/api/rooms/${roomId}/manage_request/`,
                { action, request_id: requestId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

           
            setPendingMembers(prev => prev.filter(member => member.id !== requestId));
            onAccept();
        } catch (err) {
            console.error("Error updating member status:", err);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Pending Members
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            ) : (
                pendingMembers.length === 0 ? (
                    <Typography align="center" color="#888">
                        No pending members.
                    </Typography>
                ) : (
                    <List>
                        {pendingMembers.map((member) => (
                            <ListItem
                                key={member.id}
                                sx={{
                                    backgroundColor: "rgba(24, 111, 101, 0.1)",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <ListItemText primary={`${member.email}`} />
                                <Box>
                                    <Button 
                                        onClick={() => handleAction(member.id, "accept")} 
                                        sx={{ color: "green",marginRight: .5, minWidth: 'auto' }} 
                                        size="small" 
                                    >
                                        <CheckIcon sx={{ fontSize: 20 }} /> 
                                    </Button>
                                    <Button 
                                        onClick={() => handleAction(member.id, "reject")} 
                                        sx={{ color: "red", padding: .5, minWidth: 'auto' }} 
                                        size="small" 
                                    >
                                        <CloseIcon sx={{ fontSize: 20 }} /> 
                                    </Button>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )
            )}
        </Box>  
    );
};

export default PendingCards;

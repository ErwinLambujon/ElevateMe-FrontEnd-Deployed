import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../../helpers/axios';
import DeleteDialog from "../../deletedialogpopup/DeleteDialog"; 
import { API_BASE_URL } from '../../../../helpers/constant';


const MembersListChannel = ({ roomId, onAddMembers, onClose, user, channelId }) => {
    const [members, setMembers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [roomOwnerId, setRoomOwnerId] = useState(null); 

    useEffect(() => {
        const fetchMembersEmails = async () => {
            try {
                let token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                const membersResponse = await axiosInstance.get(
                    `/api/channels/${channelId}/members/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );

                const membersData = await Promise.all(
                    membersResponse.data.map(async (member) => {
                        const userResponse = await axiosInstance.get(
                            `/api/user/${member.member_id}/`,
                            {
                                headers: {
                                    Authorization: `Token ${token}`,
                                },
                            }
                        );
                        return {
                            id: member.member_id,
                            email: userResponse.data.email,
                        };
                    })
                );

                setMembers(membersData);
            } catch (err) {
                setError(err.message);
                setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        const fetchRoomOwnerId = async () => {
            try {
                let token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                const roomResponse = await axiosInstance.get(
                    `/api/rooms/${roomId}/`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );

                setRoomOwnerId(roomResponse.data.room_owner_id);
            } catch (err) {
                console.error("Error fetching room owner ID:", err);
            }
        };

        fetchMembersEmails();
        fetchRoomOwnerId(); 
    }, [roomId]);

    const handleDeleteClick = (member) => {
        setMemberToDelete(member);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        let token = localStorage.getItem("token");

        try {
            await axiosInstance.delete(`/api/channels/${channelId}/members/${memberToDelete.id}/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            setMembers((prevMembers) =>
                prevMembers.filter((member) => member.id !== memberToDelete.id)
            );
            setSnackbar({ open: true, message: 'Member deleted successfully!', severity: 'success' });
        } catch (error) {
            console.error("Error deleting memberss:", error);
            setSnackbar({ open: true, message: 'Error deleting member', severity: 'error' });
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setMemberToDelete(null);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ textAlign: "center", marginTop: -3 }}>
                Channel Members
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            ) : members.length === 0 ? (
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#888",
                        backgroundColor: "rgba(24, 111, 101, 0.05)",
                        borderRadius: "8px",
                        height: "250px",
                        padding: 4,
                        marginBottom: 8,
                    }}
                >
                    <Typography variant="body2">
                        No Members available. Click 'Add member' to create one.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <List>
                        {members.map((member) => (
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
                                <ListItemText primary={member.email} sx={{ color: "#000" }} />
                                {user.user_type !== "STUDENT" && member.id !== roomOwnerId && (
                                    <Button
                                        onClick={() => handleDeleteClick(member)}
                                        sx={{  color: "rgba(0, 0, 0, 0.54)", minWidth: 'auto',
                                            "&:hover": {
                                              color: "#d32f2f",
                                              minWidth: 'auto'
                                            }, }} 
                                    >
                                       <DeleteIcon />     
                                    </Button>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
            {user?.user_type !== "STUDENT" && (
                <Box>
                    <Box sx={{ position: 'absolute', display: 'flex', justifyContent: 'center', bottom: 55, left: 0, right: 0 }}>
                        <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#187569', margin: '0 4px' }} />
                        <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ddd', margin: '0 4px' }} />
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 2,
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={onClose}
                            sx={{
                                borderRadius: "20px",
                                padding: "8px 24px",
                                backgroundColor: "#187569",
                                "&:hover": {
                                    backgroundColor: "#145c56",
                                },
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onAddMembers}
                            sx={{
                                borderRadius: "20px",
                                padding: "8px 24px",
                                backgroundColor: "#187569",
                                "&:hover": {
                                    backgroundColor: "#145c56",
                                },
                            }}
                        >
                            <AddIcon sx={{ marginRight: 1 }} />
                            Add
                        </Button>
                    </Box>
                </Box>
            )}
            {user?.user_type === "STUDENT" && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 2,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={onClose}
                        sx={{
                            borderRadius: "20px",
                            padding: "8px 24px",
                            backgroundColor: "#187569",
                            "&:hover": {
                                backgroundColor: "#145c56",
                            },
                        }}
                    >
                        Close
                    </Button>
                </Box>
            )}

            <DeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onDelete={handleDelete}
               
                content={
                    <>
                        Are you sure you want to remove: <span style={{ fontWeight: 'bold' }}>{memberToDelete?.email}</span> in this channel?
                    </>
                }
                isDeleting={isDeleting}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MembersListChannel;

import React, { useState, useEffect } from "react";
import axiosInstance from '../../../../helpers/axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Chip,
    Stack,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { API_BASE_URL } from '../../../../helpers/constant';


const AddMemberChannel = ({ channelId, emailDatabase, onSubmit, onBack }) => {
    const [emailInput, setEmailInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [addedEmails, setAddedEmails] = useState([]);
    const [members, setMembers] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Fetch current members of the channel
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
                setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
            }
        };

        fetchMembersEmails();
    }, [channelId]);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setEmailInput(input);

        const lastTypedEmail = input.split(",").pop().trim();
        if (lastTypedEmail) {
            updateSuggestions(lastTypedEmail);
        } else {
            setSuggestions([]);
        }
    };

    const updateSuggestions = (query) => {
        const membersEmails = members.map((member) => member.email);
        const filteredSuggestions = emailDatabase
            .filter((email) => email.toLowerCase().includes(query.toLowerCase()))
            .filter((email) => !addedEmails.includes(email) && !membersEmails.includes(email));

        setSuggestions(filteredSuggestions);
    };

    const handleAddEmail = (selectedEmail) => {
        if (selectedEmail && !addedEmails.includes(selectedEmail)) {
            setAddedEmails((prev) => [...prev, selectedEmail]);
        }
        setEmailInput("");
        setSuggestions([]);
    };

    const handleDeleteEmail = (emailToDelete) => {
        setAddedEmails(addedEmails.filter((email) => email !== emailToDelete));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && emailInput.trim()) {
            handleAddEmail(emailInput.trim());
        }
    };

    const handleSubmit = () => {
        const invalidEmails = addedEmails.filter(
            (email) => !emailDatabase.includes(email)
        );

        if (invalidEmails.length > 0) {
            setSnackbar({
                open: true,
                message: `These members are not part of the room: ${invalidEmails.join(", ")}`,
                severity: "error",
            });
            return;
        }

        if (addedEmails.length > 0) {
            onSubmit(addedEmails);
            setAddedEmails([]);
            setSnackbar({
                open: true,
                message: "Members added successfully!",
                severity: "success",
            });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
            <div>
                <Typography variant="h6" gutterBottom sx={{ textAlign: "center", marginTop: -3 }}>
                    Add Members
                </Typography>
                <TextField
                    label="Enter Email(s)"
                    variant="outlined"
                    fullWidth
                    value={emailInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    sx={{
                        mb: 2,
                        borderRadius: 4,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                        },
                    }}
                />
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Selected Email Tags
                </Typography>
                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{
                        mb: 2,
                        height: 60,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    {addedEmails.length > 0 ? (
                        addedEmails.map((email, index) => (
                            <Chip
                                key={index}
                                label={email}
                                onDelete={() => handleDeleteEmail(email)}
                                sx={{
                                    backgroundColor: "rgba(24, 111, 101, 0.1)",
                                    color: "rgba(24, 111, 101, 0.8)",
                                    border: "1px solid rgba(24, 111, 101, 0.3)",
                                }}
                            />
                        ))
                    ) : (
                        ["sample@email.com", "anothersample@gmail.com"].map((sampleEmail, index) => (
                            <Chip
                                key={index}
                                label={sampleEmail}
                                sx={{
                                    backgroundColor: "rgba(24, 111, 101, 0.05)",
                                    color: "rgba(24, 111, 101, 0.5)",
                                    border: "1px solid rgba(24, 111, 101, 0.1)",
                                    fontStyle: "italic",
                                }}
                            />
                        ))
                    )}
                </Stack>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Suggested Emails
                </Typography>
                <List
                    sx={{
                        height: 120,
                        overflowY: "auto",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    {suggestions.length > 0 ? (
                        suggestions.map((email, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => handleAddEmail(email)}
                                sx={{
                                    backgroundColor: "rgba(24, 111, 101, 0.1)",
                                    borderRadius: "4px",
                                    marginBottom: "4px",
                                }}
                            >
                                <ListItemText primary={email} />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText
                                primary="No suggestions available"
                                sx={{
                                    color: "rgba(24, 111, 101, 0.4)",
                                    fontStyle: "italic",
                                }}
                            />
                        </ListItem>
                    )}
                </List>
            </div>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                    <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ddd', margin: '0 4px' }} />
                    <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#187569', margin: '0 4px' }} />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        position: 'relative',
                        bottom: '20px',
                        gap: 2, 
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={onBack}
                        sx={{
                            borderRadius: "20px",
                            padding: "8px 24px",
                            backgroundColor: "#187569",
                            "&:hover": {
                                backgroundColor: "#145c56",
                            },
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            borderRadius: "20px",
                            padding: "8px 24px",
                            backgroundColor: "#187569",
                            "&:hover": {
                                backgroundColor: "#145c56",
                            },
                        }}
                    >
                        <CheckIcon sx={{ marginRight: 1 }} />
                        Add
                    </Button>
                </Box>
                
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default AddMemberChannel;

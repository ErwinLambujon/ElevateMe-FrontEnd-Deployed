import React, { useState, useEffect } from "react";
import axiosInstance from '../../../helpers/axios';
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
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { API_BASE_URL } from '../../../helpers/constant';


const AddMember = ({ emailDatabase, onSubmit, onBack, roomId }) => {
    const [emailInput, setEmailInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [addedEmails, setAddedEmails] = useState([]);
    const [currentMembers, setCurrentMembers] = useState([]);

    useEffect(() => {
        const fetchMembersEmails = async () => {
            try {
                let token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                const membersResponse = await axiosInstance.get(
                    `/api/rooms/${roomId}/members/`,
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
                        return userResponse.data.email;
                    })
                );

                setCurrentMembers(membersData);
            } catch (err) {
                console.error("Error fetching members:", err.message);
            }
        };

        fetchMembersEmails();
    }, [roomId]);

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
        const filteredSuggestions = emailDatabase
            .filter((email) => email.toLowerCase().includes(query.toLowerCase()))
            .filter((email) => !addedEmails.includes(email) && !currentMembers.includes(email));

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
        if (addedEmails.length > 0) {
            onSubmit(addedEmails);
            setAddedEmails([]);
        }
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
                        height: 220,
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
                            <ListItemText  primary="No suggestions available" sx={{
                                        color: "rgba(24, 111, 101, 0.4)",
                                        fontStyle: "italic",
                                    }} />
                        </ListItem>
                    )}
                </List>
            </div>

            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
                    <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ddd', margin: '0 4px' }} />
                    <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#187569', margin: '0 4px' }} />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent:"center",
                        position: 'relative',
                        bottom: '-10px',
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
            </Box>
        </Box>
    );
};

export default AddMember;

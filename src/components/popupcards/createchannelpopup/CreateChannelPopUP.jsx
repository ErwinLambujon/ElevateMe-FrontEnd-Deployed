import {
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box,
    Snackbar, Alert, Popper, Paper, List, ListItem, ListItemText, ClickAwayListener
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import axiosInstance from '../../../helpers/axios';
import { API_BASE_URL } from '../../../helpers/constant';


const CreateChannelPopup = ({ open, onClose, roomId, onChannelCreated }) => {
    const [channelName, setChannelName] = useState("");
    const [members, setMembers] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [userEmails, setUserEmails] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const memberInputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setChannelName("");
            setMembers("");
            fetchUserEmails();
        }
    }, [open]);

    const fetchUserEmails = async () => {
        try {
            const response = await axiosInstance.get(`/api/user/`);
            const emails = response.data.map(user => user.email);
            setUserEmails(emails);
        } catch (error) {
            console.error("Error fetching user emails:", error);
        }
    };

    const handleMemberInputChange = (e) => {
        const input = e.target.value;
        setMembers(input);
        setAnchorEl(memberInputRef.current);

        const selectedEmails = input
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);

        const lastEmailPart = input.split(',').pop().trim();

        if (lastEmailPart) {
            const filtered = userEmails.filter(email =>
                email.toLowerCase().includes(lastEmailPart.toLowerCase()) &&
                !selectedEmails.includes(email)
            );
            setFilteredEmails(filtered);
        } else {
            setFilteredEmails([]);
        }
    };

    const handleEmailSelect = (email) => {
        const emailArray = members.split(',').slice(0, -1)
            .map(item => item.trim())
            .filter(item => item.length > 0);

        if (!emailArray.includes(email)) {
            setMembers(emailArray.length > 0 ? `${emailArray.join(', ')}, ${email}, ` : `${email}, `);
        }
        
        setFilteredEmails([]);
        setAnchorEl(null);
    };

    const handleClickAway = () => {
        setFilteredEmails([]);
        setAnchorEl(null);
    };

    const handleCreate = async () => {
        const memberEmails =  members.trim() ? members.split(',').map(email => email.trim()).filter(email => email.length > 0) : [];
        const payload = {
            channel_name: channelName,
            room_id: roomId,
            channel_members: memberEmails,
        };

        try {
            setLoading(true);
            let token = localStorage.getItem("token");

            const response = await axiosInstance.post(`/api/channels/`, payload, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            onChannelCreated(response.data);

            setSnackbar({ open: true, message: "Channel created successfully!", severity: "success" });

            setChannelName("");
            setMembers("");
            onClose();
        } catch (error) {
            console.error("Error creating channel:", error);
            setSnackbar({ open: true, message: "Error creating channel. Please try again.", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        width: '400px',
                        padding: '16px',
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Create a New Channel
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Channel Name"
                        fullWidth
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        sx={{
                            borderRadius: 4,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            ref={memberInputRef}
                            label="Members"
                            fullWidth
                            value={members}
                            onChange={handleMemberInputChange}
                            margin="normal"
                            variant="outlined"
                            helperText="Enter member emails separated by commas"
                            sx={{
                                borderRadius: 4,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <Popper
                            open={Boolean(anchorEl) && filteredEmails.length > 0}
                            anchorEl={anchorEl}
                            placement="bottom-start"
                            style={{ width: anchorEl ? anchorEl.clientWidth : undefined, zIndex: 1301 }}
                        >
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        maxHeight: '200px',
                                        overflow: 'auto',
                                        mt: 1,
                                        borderRadius: '10px',
                                    }}
                                >
                                    <List>
                                        {filteredEmails.map((email) => (
                                            <ListItem
                                                button
                                                onClick={() => handleEmailSelect(email)}
                                                key={email}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(24, 111, 101, 0.1)',
                                                    },
                                                }}
                                            >
                                                <ListItemText primary={email} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </ClickAwayListener>
                        </Popper>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Button
                            onClick={onClose}
                            variant="contained"
                            color="secondary"
                            sx={{
                                borderRadius: 20,
                                padding: '8px 24px',
                                backgroundColor: '#186F65',
                                color: 'white',
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            variant="contained"
                            color="primary"
                            sx={{
                                borderRadius: 20,
                                padding: '8px 24px',
                                backgroundColor: '#186F65',
                                color: 'white',
                            }}
                            disabled={loading || !channelName}
                        >
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateChannelPopup;

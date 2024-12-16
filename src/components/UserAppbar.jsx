import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import useAuth from "../hooks/useAuth";


const UserAppbar = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const { Logout } = useAuth();
	const open = Boolean(anchorEl);
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const { getCurrentlyLogin } = useAuth();

	const menuItems = {
		home: "Home",
		venn: "Venn",
		saved: "Saved",
		rank: "Ranking",
		five_whys: "Five-Whys",
		hmw: "How Might We",
		report: "Report",
		room: "Rooms",
	};

	useEffect(() => {
		const fetchUser = async () => {

			try {
				const loginUser = await getCurrentlyLogin();
				
			setUser(loginUser);
				


			} catch (error) {
				console.error("Error fetching user:", error);
				setUser(null);
			}


		};
		fetchUser();
	}, []);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogoClick = () => {
		navigate("/home", { replace: true });
	};

	const handleMenuOptionClick = (path) => {
		navigate(`/${path}`, { replace: true });
		handleClose();
	};

	return (
		<Box>
			<AppBar
				position="static"
				elevation={2}
				sx={{
					bgcolor: "white",
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0)",
					marginBottom: 3,
				}}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						px: 4,
						py: 2,
					}}>
					<Typography
						variant="h4"
						onClick={handleLogoClick}
						sx={{
							cursor: "pointer",
							fontWeight: "bold",
							color: "#186F65",
							"&:hover": { color: "#165" },
						}}>
						ElevateMe
					</Typography>
	
					{user ? (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Box sx={{ textAlign: "right" }}>
								<Typography
									variant="body1"
									sx={{ fontWeight: 500, color: "#444", marginBottom: -0.5 }}>
									{user.first_name} {user.last_name}
								</Typography>
								<Typography variant="caption" sx={{ color: "#666" }}>
									{user.user_type === "STUDENT" ? "Student" : "Teacher"}
								</Typography>
							</Box>
							<IconButton
								onClick={handleClick}
								sx={{
									"&:hover": { bgcolor: "#f0f0f0" },
									transition: "background-color 0.3s",
								}}>
								<Avatar
									sx={{
										bgcolor: "#186F65",
										color: "white",
										fontWeight: "bold",
									}}
									alt={user.first_name}>
									{user.first_name?.charAt(0).toUpperCase()}
								</Avatar>
							</IconButton>
						</Box>
					) : (
						<Typography variant="body1" sx={{ color: "#666" }}>
							Loading user info...
						</Typography>
					)}
	
					<Menu
						id="avatar-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "avatar-menu-button",
						}}
						sx={{ mt: 1 }}>
						{user && (
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									padding: 2,
									borderBottom: "1px solid #f0f0f0",
									width: "200px",
								}}>
								<Avatar
									sx={{
										bgcolor: "#186F65",
										color: "white",
										fontWeight: "bold",
										width: 56,
										height: 56,
										mb: 1,
									}}
									alt={user.first_name}>
									{user.first_name.charAt(0).toUpperCase()}
								</Avatar>
								<Typography
									variant="subtitle1"
									sx={{ fontWeight: "bold", color: "#444" }}>
									Hi, {user.first_name}!
								</Typography>
								<Typography variant="caption" sx={{ color: "#666" }}>
									{user.email}
								</Typography>
							</Box>
						)}
						{Object.entries(menuItems).map(([key, value]) => (
							<MenuItem
								key={key}
								onClick={() =>
									value === "Log Out" ? Logout() : handleMenuOptionClick(key)
								}
								sx={{
									"&:hover": {
										backgroundColor: "#f4f4f4",
									},
									px: 3,
									py: 1,
								}}>
								{value}
							</MenuItem>
						))}
						<Divider />
						<MenuItem
							onClick={Logout}
							sx={{
								color: "#d32f2f",
								"&:hover": { backgroundColor: "#ffebee" },
								px: 3,
								py: 1,
							}}>
							Log Out
						</MenuItem>
					</Menu>
				</Box>
			</AppBar>
			<Outlet />
		</Box>
	);
	
};

export default UserAppbar;

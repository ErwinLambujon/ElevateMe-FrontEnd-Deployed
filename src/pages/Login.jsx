import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useTheme from "@mui/material/styles/useTheme";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Login = () => {
	var theme = useTheme();

	const { Login } = useAuth();

	const formLabel = {
		color: "text.main",
		marginLeft: "1.5rem",
	};

	const inputProps = {
		sx: {
			borderRadius: "50px",
			"& fieldset": { borderColor: "stroke.main" },
		},
	};

	const inputSx = {
		boxSizing: "border-box",
		width: "100%",
	};

	const inputFieldContainer = {
		paddingTop: "25px",
		paddingBottom: "25px",
	};

	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await Login(user);
	};

	return (
		<Grid
			container
			spacing={0}
			direction="row"
			alignItems="center"
			justifyContent="center"
			minHeight={"100vh"}>
			<Grid item xs={11} md={5} xl={5}>
				<Paper
					elevation={0}
					sx={{
						borderRadius: "32px",
						paddingTop: "2.5rem",
						paddingBottom: "2.5rem",
						userSelect: "none",
						textAlign: "center",
					}}>
					<h1
						style={{
							margin: 0,
							color: theme.palette.primary.main,
						}}>
						ElevateMe
					</h1>
					<form
						onSubmit={handleSubmit}
						style={{
							width: "100%",
							boxSizing: "border-box",
							paddingLeft: "5rem",
							paddingRight: "5rem",
						}}>
						<FormControl sx={{ width: "100%" }}>
							<Box sx={inputFieldContainer}>
								<Box align="left">
									<FormLabel sx={formLabel}>Email</FormLabel>
								</Box>
								<TextField
									InputProps={inputProps}
									sx={inputSx}
									name="email"
									id="email"
									value={user.email}
									onChange={handleChange}
								/>
							</Box>
							<Box sx={inputFieldContainer}>
								<Box align="left">
									<FormLabel sx={formLabel}>Password</FormLabel>
								</Box>
								<TextField
									InputProps={inputProps}
									sx={inputSx}
									type="password"
									name="password"
									id="password"
									value={user.password}
									onChange={handleChange}
								/>
							</Box>
							<Button
								type="submit"
								color="primary"
								variant="contained"
								sx={{
									borderRadius: "50rem",
									boxSizing: "border-box",
									width: "100%",
									height: "4rem",
									marginTop: "3rem",
									fontSize: "1.2rem",
									fontWeight: "bold",
								}}>
								Sign in
							</Button>
						</FormControl>
					</form>
					<Box sx={{ marginTop: "1rem" }}>
						Don't have an account?{" "}
						<Link
							to="/register"
							style={{
								color: "primary.main",
								textDecoration: "none",
							}}>
							Sign up
						</Link>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default Login;

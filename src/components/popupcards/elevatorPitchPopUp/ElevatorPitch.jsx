import React, { useState } from "react";
import {
	Grid,
	Box,
	Card,
	CardContent,
	Button,
	Dialog,
	DialogContent,
	DialogActions,
	Typography,
	TextField,
} from "@mui/material";
import { useTheme } from "@emotion/react";

const pitch = [
	"For",
	"Who",
	"We Provide",
	"That",
	"Unlike",
	"Who",
	"Our solution",
	"That",
];

const ElevatorPitch = ({ data, setOpenElevator, setElevatorPitch }) => {
	const handleClose = (event, reason) => {
		if (reason === "backdropClick" || reason === "escapeKeyDown") {
			setOpenElevator(false);
		}
	};

	const [dataState, setDataState] = useState([
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	]);
	const [elevator, setElevator] = useState(data);

	const handleTypographyClick = (index) => {
		setDataState((prevDataState) => {
			const newDataState = [...prevDataState];
			newDataState[index] = true;
			return newDataState;
		});
	};

	const handleTextFieldChange = (index, value) => {
		setElevator((prevElevator) => {
			const newElevator = [...prevElevator];
			newElevator[index] = value;
			return newElevator;
		});
	};

	const handleTextFieldKeyDown = (index, event) => {
		if (event.key === "Enter") {
			setDataState((prevDataState) => {
				const newDataState = [...prevDataState];
				// console.log(newDataState);
				newDataState[index] = false;
				return newDataState;
			});
			setElevator((prevElevator) => {
				const newElevator = [...prevElevator]; // Reset elevator state to the original data
				// console.log();
				return newElevator;
			});
			setElevatorPitch(elevator); // Update the parent component's data
		}
	};

	const theme = useTheme();

	return (
		<Dialog
			open={true}
			onClose={handleClose}
			disableEnforceFocus
			PaperProps={{
				sx: {
					width: "50%",
					maxHeight: "80%",
					borderRadius: "8px",
				},
			}}>
			<DialogContent
				sx={{
					display: "flex",
					flexDirection: "column",
					padding: "2rem",
					userSelect: "none",
					overflowY: "auto",
				}}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						color: theme.palette.primary.main,
						fontSize: "30px",
						marginBottom: "2rem",
						justifyContent: "center",
					}}>
					<strong>Elevator Pitch</strong>
				</Box>
				{pitch.map((pitch, index) => (
					<Grid item xs={12} key={index}>
						<Box
							sx={{
								display: "flex",
								marginBottom: "20px",
								justifyContent: "center",
							}}>
							<Card
								sx={{
									flex: "0 0 20%",
									backgroundColor: theme.palette.grey[300],
									color: "black",
									textAlign: "center",
								}}>
								<CardContent
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										height: "100%",
									}}>
									{pitch}
								</CardContent>
							</Card>
							<Box sx={{ width: "20px" }} /> {/* Gap between cards */}
							<Card
								sx={{
									flex: "1",
									backgroundColor: theme.palette.grey[300],
									textAlign: "center",
								}}>
								<CardContent>
									{dataState[index] ? (
										<TextField
											fullWidth
											defaultValue={elevator[index]}
											onChange={(e) =>
												handleTextFieldChange(index, e.target.value)
											}
											onKeyDown={(e) => handleTextFieldKeyDown(index, e)}
										/>
									) : (
										<Typography
											onClick={() => handleTypographyClick(index)}
											sx={{ cursor: "pointer" }}>
											{elevator[index] || "Click to edit"}
										</Typography>
									)}
								</CardContent>
							</Card>
						</Box>
					</Grid>
				))}
			</DialogContent>
			<DialogActions
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					padding: "1rem",
				}}>
				<Button
					variant="contained"
					sx={{ marginRight: "10px", borderRadius: "25px" }}
					onClick={() => {
						setOpenElevator(false);
						handleClose();
					}}>
					Closed
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ElevatorPitch;

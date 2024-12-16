import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useState, useRef } from "react";

import VennSettingsHistoryPopup from "../components/popupcards/vennsettingspopup/VennSettingsHistory";

const SavedPSCard = ({ id, statement, venn, onDelete, setting, onEdit }) => {
	const [openPopup, setOpenPopup] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [editedStatement, setEditedStatement] = useState(statement);

	const handleOpenPopup = () => {
		setOpenPopup(!openPopup);
	};

	const setTextFieldToEditable = () => {
		setIsEditable((prev) => !prev);
	};

	return (
		<Box>
			<Card
				key={id}
				sx={{
					display: "flex",
					position: "relative",
					marginX: 7,
					zIndex: 1,
					marginY: 1.4,
					borderRadius: 5,
					boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 35px 0px",
				}}>
				<CardContent
					sx={{
						display: "flex",
						alignItems: "center",
						width: "100%",
					}}>
					<Grid container alignItems="center">
						<Grid item>
							<IconButton onClick={setTextFieldToEditable}>
								{/* 
							TODO: Add this later on the icon button functionality
							onClick={() => setIsEditable((prev) X=> !prev)}
							*/}
								<EditIcon />
							</IconButton>
						</Grid>
						<Grid item xs>
							<Box>
								{isEditable ? (
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}>
										<TextField
											sx={{ width: "100%" }}
											onChange={(e) => {
												setEditedStatement((prev) => e.target.value);
											}}
											defaultValue={editedStatement}
											autoFocus={isEditable}
										/>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "end",
											}}>
											<Box sx={{ mx: 1 }}>
												<Button
													variant="outlined"
													color="error"
													onClick={() => {
														setIsEditable((prev) => !prev);
														onEdit(setting, id, editedStatement);
													}}>
													Edit
												</Button>
											</Box>
											<Box>
												<Button
													variant="outlined"
													onClick={() => {
														setIsEditable((prev) => !prev);
													}}>
													Cancel
												</Button>
											</Box>
										</Box>
									</Box>
								) : (
									<Typography variant="body1">{editedStatement}</Typography>
								)}
							</Box>
						</Grid>
						<Grid item sx={{ mx: 1 }}>
							<IconButton onClick={handleOpenPopup}>
								<Button variant="contained" sx={{ px: 3, borderRadius: 5 }}>
									Show
								</Button>
							</IconButton>
						</Grid>
						<Grid item sx={{ mr: 1 }}>
							<IconButton onClick={() => onDelete(setting, id)}>
								<DeleteIcon color="error" />
							</IconButton>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
			<VennSettingsHistoryPopup
				venn={venn}
				setting={setting}
				open={openPopup}
				onClose={() => setOpenPopup(false)}
			/>
		</Box>
	);
};

export default SavedPSCard;

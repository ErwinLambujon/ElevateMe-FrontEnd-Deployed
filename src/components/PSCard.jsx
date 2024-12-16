import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const PSCard = ({ text, handleSaveProblemStatement }) => {
	return (
		<Card
			sx={{ borderRadius: 6.2, boxShadow: 3, width: "80%", margin: "auto" }}>
			<CardContent sx={{ display: "flex" }}>
				<IconButton onClick={() => handleSaveProblemStatement(text)}>
					<AddCircleOutlineIcon />
				</IconButton>
				<Typography variant="body1" sx={{ mt: 1, color: "#8e8e8e" }}>
					{text}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default PSCard;

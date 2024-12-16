import { Card, CardContent, Typography, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import React from "react";

const PSListCard = ({ id, venn, statement, addStatement }) => {
	return (
		<div>
			<Card
				sx={{
					width: "100%",
					borderRadius: 6.2,
					boxShadow: 3,
				}}>
				<CardContent sx={{ display: "flex", alignItems: "center" }}>
					<IconButton
						onClick={() => {
							addStatement(id, venn, statement);
						}}>
						<AddCircleOutlineIcon />
					</IconButton>
					<Typography variant="body1" sx={{ mt: 1, color: "#00000" }}>
						{statement}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
};

export default PSListCard;

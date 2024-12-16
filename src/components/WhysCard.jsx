import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const WhysCard = ({
	value,
	index,
	addWhysToList,
	setFiveWhys,
	modifyFiveWhys,
}) => {
	const [text, setText] = useState(value);

	useEffect(() => {
		setText(value); // Update internal state when props change
	}, [value]);

	return (
		<Card
			sx={{
				borderRadius: 6.2,
				boxShadow: 3,
				maxWidth: "800px",
				width: "95%",
				margin: "auto",
			}}>
			<CardContent sx={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => {
						modifyFiveWhys(index);
					}}>
					<CheckCircleOutlinedIcon />
				</IconButton>
				<Typography
					variant="body1"
					sx={{
						mt: 1,
						minWidth: "100px",
						minHeight: "20px",
						color: "#000000",
						cursor: "pointer",
						ml: 2,
					}}>
					{text}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default WhysCard;

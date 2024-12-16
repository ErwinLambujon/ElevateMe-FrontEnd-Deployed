import {
	
	Card,
	CardContent,
	IconButton,
	InputBase,
	Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React, { useState } from "react";

const WhysCard = ({ value, addHMWToList, setFiveHMW }) => {
	const [isSelected, setIsSelected] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [text, setText] = useState(value);

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	const handleSave = () => {
		setIsEditing((prev) => !prev);

		setFiveHMW((prev) =>
			prev.map((hmw, index) => (hmw === value ? text : hmw))
		);
	};

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
						setIsSelected((prev) => !prev);
						addHMWToList(value);
					}}>
					{isSelected ? <CheckCircleIcon sx={{color:"#00000"}}/> : <CheckCircleOutlinedIcon />}
				</IconButton>
				{isEditing ? (
					<InputBase
						value={text}
						onChange={handleTextChange}
						onBlur={handleSave}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSave();
							}
						}}
						autoFocus
						fullWidth
						sx={{ ml: 2 }}
					/>
				) : (
					<Typography
						variant="body1"
						sx={{
							mt: 1,
							minWidth: "100px",
							minHeight: "20px",
							color: "#00000",
							cursor: "pointer",
							ml: 2,
						}}
						onClick={() => {
							if (isSelected) {
								alert("Cannot modify as already been selected.");
								return;
							}
							setIsEditing(true);
						}}>
						{text}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default WhysCard;

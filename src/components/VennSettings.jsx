import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";

const VennSettings = ({
	toggleShowSetting,
	textFields,
	setTextFields,
	selectedButton,
	setSelectedButton,
}) => {
	const componentRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				componentRef.current &&
				!componentRef.current.contains(event.target)
			) {
				toggleShowSetting();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [toggleShowSetting]);

	const handleChangeButton = (e) => {
		const value = +e.target.value;
		setSelectedButton((prev) => (prev = value));
		if (value === 2 && textFields.field3 !== undefined) {
			setTextFields((prev) => {
				const { field3, ...rest } = prev;
				return rest;
			});
		} else {
			setTextFields((prev) => ({ ...prev, field3: "" }));
		}
	};
	const handleApplyButtonClick = () => {
		sessionStorage.setItem("setting", selectedButton);
		sessionStorage.setItem("field1", textFields.field1);
		sessionStorage.setItem("field2", textFields.field2);
		if (textFields.field3 !== undefined) {
			sessionStorage.setItem("field3", textFields.field3);
		}
		sessionStorage.setItem("filter", textFields.filter);
		sessionStorage.setItem("setting", selectedButton);

		toggleShowSetting();
	};

	return (
		<Box ref={componentRef} sx={{ height: "560px", width: "450px" }}>
			<Card sx={{ borderRadius: 6, width: "100%", height: "100%" }}>
				<CardContent sx={{ m: 1.6 }}>
					<Typography variant="h5" sx={{ color: "#186F65" }}>
						Venn Diagram Settings
					</Typography>
					<Box sx={{ mx: 4, mt: 3 }}>
						<Grid container>
							<Grid item xs sx={{ display: "flex", alignItems: "center" }}>
								<Typography>Number of fields:</Typography>
							</Grid>
							<Grid item>
								<RadioGroup
									name="radio-button-group"
									value={selectedButton}
									onChange={handleChangeButton}
									sx={{ flexDirection: "row" }}>
									<FormControlLabel value="2" control={<Radio />} label="2" />
									<FormControlLabel value="3" control={<Radio />} label="3" />
								</RadioGroup>
							</Grid>
						</Grid>
						{Object.keys(textFields)
							.filter(
								(key) =>
									key !== "filter" && (selectedButton === 3 || key !== "field3")
							)
							.map((key, index) => (
								<Box key={key} sx={{ mt: 2 }}>
									<FormLabel sx={{ fontSize: "0.7rem", color: "#8E8E8E" }}>
										{`Field ${index + 1}:`}
									</FormLabel>
									<TextField
										sx={{
											fontSize: "0.7rem",
											color: "#8E8E8E",
											"& .MuiOutlinedInput-root": {
												borderRadius: 2.3,
											},
										}}
										placeholder={`Scope ${index + 1}...`}
										InputProps={{
											style: {
												height: 40,
												width: 340,
												fontSize: "0.7rem",
											},
										}}
										value={textFields[key]}
										onChange={(e) =>
											setTextFields({ ...textFields, [key]: e.target.value })
										}
									/>
								</Box>
							))}

						<Box sx={{ mt: 1.2 }}>
							<FormLabel sx={{ fontSize: "0.7rem", color: "#8E8E8E" }}>
								Filter
							</FormLabel>
							<TextField
								sx={{
									fontSize: "0.7rem",
									color: "#8E8E8E",
									"& .MuiOutlinedInput-root": {
										borderRadius: 2.3,
									},
								}}
								placeholder="Write your desired filter here......"
								InputProps={{
									style: {
										height: 80,
										width: 340,
										fontSize: "0.7rem",
									},
								}}
								value={textFields.filter}
								onChange={(e) =>
									setTextFields({ ...textFields, filter: e.target.value })
								}
							/>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								mt: 3,
							}}>
							<Button
								variant="contained"
								sx={{
									mx: 1,
									px: 5,
									background: "#BAD4D1",
									color: "#186F65",
									borderRadius: 4,
									"&:hover": {
										background: "#C2DBD8",
									},
								}}
								onClick={toggleShowSetting}>
								Close
							</Button>
							<Button
								onClick={handleApplyButtonClick}
								variant="contained"
								sx={{ mx: 1, px: 5, borderRadius: 4 }}>
								Apply
							</Button>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

export default VennSettings;

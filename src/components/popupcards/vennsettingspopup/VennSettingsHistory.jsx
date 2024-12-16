import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
	Typography,
	Box,
	InputBase,
	Paper as MuiPaper,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import "../vennsettingspopup/VennSettings.css";
import Venn3 from "../../../res/venn.png";
import Venn2Paper from "../../venndiagram/VennDiagramPaper2";
import Venn3Paper from "../../venndiagram/VennDiagramPaper3"
import { useNavigate } from "react-router-dom";

const VennSettingsHistoryPopup = ({ setting, venn, open, onClose }) => {
	const [inputValues, setInputValues] = useState({
		...venn,
	});
	const navigate = useNavigate();

	const originalVenn = { ...venn };

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
	};

	const proceedToVenn = () => {
		navigate("/venn", { state: { venn: inputValues, setting: setting } });
	};

	const onClickClose = () => {
		setInputValues(originalVenn);
	};
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 7,
					padding: 2,
				},
			}}>
			<DialogContent>
				<Grid container spacing={2}>
					{/* Venn Diagram Picture Section */}
					<Grid item xs={12} md={6}>
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							height="100%">

							{setting === 2 ? (
								<Venn2Paper venn={inputValues} />
							) : (
								<Venn3Paper venn={inputValues} />
							)}
						</Box>
					</Grid>

					{/* Text Field Section */}
					<Grid item xs={12} md={6}>
						<Box
							className="venn-settings-section"
							sx={{ p: 2, borderRadius: 3, backgroundColor: "white" }}>
							<Typography variant="h5" gutterBottom>
								Venn Diagram Settings
							</Typography>

							<form>
								<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
									<Typography
										variant="body1"
										sx={{
											mr: 2,
											Width: "60px",
											color: "#8e8e8e",
											fontSize: "12px",
										}}>
										Field 1:
									</Typography>
									<InputBase
										name="field1"
										value={inputValues.field1}
										onChange={handleInputChange}
										sx={{
											flex: 1,
											p: 0.5,
											borderRadius: 2,
											boxShadow: 2,
											backgroundColor: "white",
											fontSize: "12px",
										}}
										fullWidth
									/>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
									<Typography
										variant="body1"
										sx={{
											mr: 2,
											Width: "60px",
											color: "#8e8e8e",
											fontSize: "12px",
										}}>
										Field 2:
									</Typography>
									<InputBase
										name="field2"
										value={inputValues.field2}
										onChange={handleInputChange}
										sx={{
											flex: 1,
											p: 0.5,
											borderRadius: 2,
											boxShadow: 2,
											backgroundColor: "white",
											fontSize: "12px",
										}}
										fullWidth
									/>
								</Box>
								{setting === 3 && (
									<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
										<Typography
											variant="body1"
											sx={{
												mr: 2,
												Width: "60px",
												color: "#8e8e8e",
												fontSize: "12px",
											}}>
											Field 3:
										</Typography>
										<InputBase
											name="field3"
											value={inputValues.field3}
											onChange={handleInputChange}
											sx={{
												flex: 1,
												p: 0.5,
												borderRadius: 2,
												boxShadow: 2,
												backgroundColor: "white",
												fontSize: "12px",
											}}
											fullWidth
										/>
									</Box>
								)}
								<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
									<Typography
										variant="body1"
										sx={{
											mr: 2,
											Width: "60px",
											color: "#8e8e8e",
											fontSize: "12px",
										}}>
										Filter :
									</Typography>
									<InputBase
										name="filter"
										value={
											inputValues.filter
												? inputValues.filter
												: "Write your desired filter here..."
										}
										onChange={handleInputChange}
										multiline
										minRows={5}
										maxRows={5}
										sx={{
											flex: 1,
											p: 2,
											maxHeight: "7.5rem", // Adjust this value to match the height of 5 lines
											borderRadius: 2,
											boxShadow: 2,
											backgroundColor: "white",
											fontSize: "12px",
											alignItems: "flex-start",
											overflow: "hidden",
											resize: "none",
											"&::-webkit-scrollbar": {
												display: "none",
											},
										}}
									/>
								</Box>
							</form>
						</Box>
						<Box sx={{display:"flex", flexDirection:"column-reverse"}}>

						
						<Box
							sx={{
								display: "flex",
								position: "absolute",
								bottom: 35,
								justifyContent: "center",
								
								marginLeft: 12,
							}}>
							<Button
								onClick={() => {
									onClose();
									onClickClose();
								}}
								type="submit"
								variant="contained"
								sx={{
									py: 1,
									px: 4.3,
									borderRadius: 5,
									marginRight: 2,
									color: "#186F65",
									backgroundColor: "#BAD4D1",
								}}>
								close
							</Button>
							<Button
								onClick={() => {
									proceedToVenn();
								}}
								variant="contained"
								sx={{ py: 1, px: 3.7, borderRadius: 5 }}>
								Proceed
							</Button>
						</Box>
						</Box>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
};

export default VennSettingsHistoryPopup;

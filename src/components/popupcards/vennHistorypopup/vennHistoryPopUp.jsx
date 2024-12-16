import React, { useState, useEffect } from "react";
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
import "../vennHistorypopup/vennHistory.css";
import Venn3Paper from "../../venndiagram/VennDiagramPaper3";
import Venn2Paper from "../../venndiagram/VennDiagramPaper2";

const VennSettingsHistoryPopup = ({ venn, open, onClose }) => {
	// console.log(venn);
	const [inputValues, setInputValues] = useState({ ...venn });

	useEffect(() => {
		// console.log(venn);
		setInputValues({ ...venn });
	}, [venn]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInputValues({ ...inputValues, [name]: value });
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
							{venn.field3 !== undefined ? (
								<Venn3Paper venn={inputValues} />
							) : (
								<Venn2Paper venn={inputValues} />
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
									<Typography
										sx={{
											flex: 1,
											p: 0.5,
											borderRadius: 2,
											boxShadow: 2,
											backgroundColor: "white",
											fontSize: "12px",
											height: "32px",
											alignItems: "center",
											justifyContent: "center",
										}}
										fullWidth>
										{inputValues.field1}
									</Typography>
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
									<Typography
										sx={{
											flex: 1,
											p: 0.5,
											borderRadius: 2,
											boxShadow: 2,
											backgroundColor: "white",
											fontSize: "12px",
											height: "32px",
											alignItems: "center",
										}}
										fullWidth>
										{inputValues.field2}{" "}
									</Typography>
								</Box>
								{venn.field3 && (
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
										<Typography
											sx={{
												flex: 1,
												p: 0.5,
												borderRadius: 2,
												boxShadow: 2,
												backgroundColor: "white",
												fontSize: "12px",
												height: "32px",
												alignItems: "center",
											}}
											fullWidth>
											{inputValues.field3}
										</Typography>
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
										name="field4"
										disabled
										value={inputValues.filter ? inputValues.filter : ""}
										onChange={handleInputChange}
										multiline
										minRows={5}
										maxRows={5}
										sx={{
											flex: 1,
											p: 2,
											maxHeight: "7.5rem",
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
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								mt: 2,
								marginLeft: 4,
							}}></Box>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
};

export default VennSettingsHistoryPopup;

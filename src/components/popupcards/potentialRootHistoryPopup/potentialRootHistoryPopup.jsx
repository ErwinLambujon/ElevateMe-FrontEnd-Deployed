import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	Typography,
	Box,
	Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RootProblemHistoryPopup = ({
	open,
	onClose,
	problemStatement,
	whyStatements,
}) => {
	
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
			<DialogTitle>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					position="relative">
					<Typography
						variant="h5"
						sx={{ fontWeight: "bold", color: "#00695C" }}>
						Potential Root Problem History
					</Typography>
					<IconButton
						onClick={onClose}
						sx={{
							position: "absolute",
							right: 0,
						}}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12} md={4}>
						<Box sx={{ p: 2 }}>
							<Typography
								variant="h6"
								sx={{ fontWeight: "bold", color: "#00695C", lineHeight: 1.3 }}>
								Selected Problem Statement
							</Typography>
							<Box
								sx={{
									mt: 2,
									p: 2,
									borderRadius: 2,
									boxShadow: 2,
									backgroundColor: "white",
									fontSize: "12px",

									textAlign: "left",
								}}>
								{problemStatement}
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12} md={8}>
						<Box
							sx={{
								p: 2,
								borderLeft: "2px solid #00695C",
								height: "100%",
							}}>
							<Typography
								variant="h6"
								sx={{
									fontWeight: "bold",
									color: "#00695C",
									maxWidth: "250px",
									lineHeight: 1.3,
								}}>
								Generated 5 Why’s Statement
							</Typography>
							<Box sx={{ mt: 2 }}>
								{/* i think nice ra nga dili nako butngan og max height ang card box, flexible */}

								{whyStatements.map((statement, index) => (
									<Typography
										key={index}
										variant="body1"
										sx={{
											mb: 2,
											p: 2,
											borderRadius: 2,
											boxShadow: 2,
											backgroundColor: "white",
											fontSize: "12px",
											color: "#8E8E8E",
										}}>
										{statement}
									</Typography>
								))}
							</Box>
						</Box>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
};

export default RootProblemHistoryPopup;

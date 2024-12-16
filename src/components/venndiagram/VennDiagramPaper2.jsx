// VennDiagramPaper.js

import React from "react";
import { Typography, Box, Paper as MuiPaper } from "@mui/material";
import Venn2 from "../../res/venn2.png";

const VennDiagramPaper = ({ venn }) => {
	return (
		<MuiPaper
			elevation={3}
			sx={{
				borderRadius: 5,
				p: 3,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100%",
			}}>
			<Typography
				variant="h4"
				sx={{ marginTop: "-8px", marginBottom: "80px", marginLeft: "-140px" }}>
				Venn Diagram
			</Typography>
			<Box
				sx={{
					position: "relative",
					marginBottom: "20px",
					marginBottom: "50px",
				}}>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Typography
						variant="h6"
						sx={{
							position: "absolute",
							top: "80px",
							left: "35px",
							color: "#8E8E8E",
							fontSize: "14px",
							maxWidth: "81px",
							textAlign: "center",
							overflow: "hidden",
							display: "-webkit-box",
							WebkitLineClamp: 3,
							WebkitBoxOrient: "vertical",
						}}>
						{venn.field1}
					</Typography>
					<Typography
						variant="h6"
						sx={{
							position: "absolute",
							top: "80px",
							right: "35px",
							color: "#8E8E8E",
							fontSize: "14px",
							maxWidth: "81px",
							textAlign: "center",
							overflow: "hidden",
							display: "-webkit-box",
							WebkitLineClamp: 3,
							WebkitBoxOrient: "vertical",
						}}>
						{venn.field2}
					</Typography>
				</Box>

				<img
					src={Venn2}
					alt="Venn Diagram"
					style={{ zIndex: 0, width: "325px", Height: "50px" }}
				/>
			</Box>
		</MuiPaper>
	);
};

export default VennDiagramPaper;

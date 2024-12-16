import { Box, CircularProgress } from "@mui/material";
import React from "react";

const LoadingScreen = () => {
	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<CircularProgress />
			</Box>
		</Box>
	);
};

export default LoadingScreen;

import {
	Box,
	ButtonBase,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
} from "@mui/material";
import React from "react";

function HomePageCards({ card, icon, title, description, handleCardClick }) {
	return (
		<Box>
			<Box>
				<Card
					sx={{
						borderRadius: 5,
						boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 35px 10px",
						height:"400px"
					}}
					elevation={3}>
					<ButtonBase onClick={() => handleCardClick(card)}>
						<CardActionArea>
							<CardContent>
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "150px",
										marginTop: 2,
									}}>
									<CardMedia
										component="img"
										src={icon}
										sx={{
											
											maxWidth: "150%",
											objectFit: "fill",
											

										}}
									/>
								</Box>
								<Typography padding={2} variant="h5" textAlign={"left"} sx={{ mt: 2, mb: -3}}>
									{title}
								</Typography>
								<Typography
									variant="body1"
									fontSize={"12px"}
									color="#8E8E8E"
									padding={2}
									textAlign={"justify"}
									>
									{description}
								</Typography>
							</CardContent>
						</CardActionArea>
					</ButtonBase>
				</Card>
			</Box>
		</Box>
	);
}

export default HomePageCards;

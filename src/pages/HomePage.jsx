import {
	Box,
	Button,
	Grid,
	Typography,
	useTheme,





} from "@mui/material";
import venn from "../res/newHomepageIcons/vennicon.png";
import save from "../res/newHomepageIcons/saveicon.png";
import list from "../res/newHomepageIcons/rankingicon.png";
import five_whys from "../res/newHomepageIcons/whysicon.png";
import HMW from "../res/newHomepageIcons/hmwicon.png";
import elevator from "../res/newHomepageIcons/elevator.png";
import Bookpng from "../res/book.png";
import GridBackground from "../res/gridbackground.png";
import HomePageCards from "../components/HomePageCards";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const navigate = useNavigate();
	const [isVisible, setIsVisible] = useState(false);
	const [buttonScale, setButtonScale] = useState(1);

	const cards = {
		venn: {
			icon: venn,
			title: "Venn Diagram",
			description:
				"Venn diagram page allows you to generate problem statements according to your specified scopes and filters. Save your selected problem statement",
		},
		saved: {
			icon: save,
			title: "Saved List",
			description:
				"The Saved List page shows you a list of saved generated problem Statements which is categorized by #2 and #3 Venn diagram. You can also see the scopes/fields of the selected statement.",
		},
		rank: {
			icon: list,
			title: "Ranking",
			description:
				"Ranking list, allows you to rank the problem statements in your list. you can also select a specific problem statement of your choice regarding the score of it. The selected statement list will be sent to 5 whys page.",
		},
		five_whys: {
			icon: five_whys,
			title: "5 Why's",
			description:
				"The 5 Why’s page allows you to generate 5 Whys based on your selected problem statement. You can also edit the generated 5 whys statements.",
		},
		hmw: {
			icon: HMW,
			title: "How Might We",
			description:
				"The HMW page allows you to generate HMW statements based on your selected Why statement. You can also edit the generated statement according to your likings. ",
		},
		report: {
			icon: elevator,
			title: "Report",
			description:
				"This page will show you the output statements. You can save it as pdf by click CTRL + P and selecting save as pdf in the option and your pdf will be ready in just seconds ",
		},
	};

	const handleCardClick = (card) => {
		navigate(`/${card}`, { replace: true });
	};

	var theme = useTheme();

	useEffect(() => {
		setButtonScale(0.8);
		const timeout = setTimeout(() => {
			setIsVisible(true);
			setButtonScale(1);
		}, 500);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<Box>
			<Grid
				container
				spacing={6}
				justifyContent={"center"}
				alignItems={"center"}
				sx={{
					backgroundImage: `url(${GridBackground})`,
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					marginBottom: "50px",


				}}>
				<Grid item xs={10} md={5} pr={5}>
					<div>
						<Typography variant="h1" fontSize="50px">
							ElevateMe
						</Typography>
						<br />
						<div
							style={{
								opacity: isVisible ? 1 : 0,
								transition: "opacity 0.5s ease-in-out",
							}}>
							{isVisible && (
								<>
									<Typography
										variant="body1"
										fontWeight={"bold"}
										textAlign={"justify"}
										fontSize="14px">
										ElevateMe is an app that generates problem statements. It
										follows the Technopreneurship Workbook. A group of CIT-U
										students made this app to automate the current and long
										process of the technopreneurship workbook.
									</Typography>
									<br />
									<Typography
										variant="body1"
										textAlign={"justify"}
										fontSize="14px">
										Its goal is to shorten the time it takes to generate
										problem statements. It follows the Technopreneurship
										Workbook. A group of CIT-U students made this app to
										automate the long process of the technopreneurship workbook.
									</Typography>
								</>
							)}
						</div>

						<br />
						<div
							style={{
								transform: `scale(${buttonScale})`,
								transition: "transform 0.3s ease-in-out",
							}}>
							<Button
								onClick={() => navigate("/room", { replace: true })}
								variant="contained"
								sx={{ py: 1, px: 5, borderRadius: 4 }}>
								Rooms
							</Button>
						</div>
					</div>
				</Grid>
				{/* Right div remains unchanged */}
				<Grid item xs={10} md={5}>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<img
							src={Bookpng}
							alt="Techno Book"
							style={{
								maxWidth: "450px",
								maxHeight: "auto",
							}}
						/>
					</Box>
				</Grid>
			</Grid>

			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "900px",
					margin: "auto",
					flexDirection: "column",
				}}>
				<Typography variant="h1" textAlign={"center"} fontSize="50px">
					Features
				</Typography>
				<Typography
					variant="body1"
					textAlign={"center"}
					fontSize="14px"
					marginBottom={"50px"}>
					Choose from the features below. This is a sequential process but you
					can always navigate to different cards if you want for easier access.
					Each card corresponds to a specific page.
				</Typography>
				<Grid container spacing={2} sx={{ marginBottom: 8 }}>
					{Object.entries(cards).map(([key, card]) => (
						<Grid item key={key} xs={4} sx={{ width: "280px" }}>
							<HomePageCards
								key={key}
								card={key}
								{...card}
								handleCardClick={handleCardClick}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default HomePage;

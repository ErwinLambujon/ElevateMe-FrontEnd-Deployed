import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
	Button,
	Grid,
	Typography,
	Card,
	CardActions,
	CardContent,
} from "@mui/material";

import PopupVennHistory from "../components/popupcards/vennHistorypopup/vennHistoryPopUp";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../helpers/axios";
import LoadingScreen from "../components/LoadingScreen";
import WhysCard from "../components/WhysCard";

const FiveWhys = () => {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);
	const [fiveWhys, setFiveWhys] = useState(
		JSON.parse(sessionStorage.getItem("five_whys")) || []
	);
	const [selectedWhys, setSelectedWhys] = useState(
		JSON.parse(sessionStorage.getItem("selected_whys")) || []
	);
	const navigate = useNavigate();

	const generateFiveWhys = async (statement) => {
		setIsLoading((prev) => !prev);
		try {
			let token = localStorage.getItem("token");
			let response = await axiosInstance.post(
				`/api/ai/five_whys/`,
				{
					ranked_problem: statement,
				},
				{
					headers: { Authorization: `Token ${token}` },
				}
			);
			setFiveWhys((prev) => [...response.data.response]);
			// console.log(response.data);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading((prev) => !prev);
		}
	};
	const statement =
		location.state?.statement ||
		sessionStorage.getItem("whys_selected_statement") ||
		"";

	const venn = location.state?.venn ||
		JSON.parse(sessionStorage.getItem("whys_venn")) || {
			field1: "",
			field2: "",
			field3: "",
		};

	const statement_id = location.state?.id || null;

	const modifyFiveWhys = async (index) => {
		try {
			let token = localStorage.getItem("token");
			setIsLoading((prev) => !prev);
			const response = await axiosInstance.post(
				`/api/ai/new_five_whys/`,
				{
					five_whys: fiveWhys,
					start_index_to_be_modify: index,
				},
				{
					Authorization: `Token ${token}`,
				}
			);

			setFiveWhys([...response.data.five_whys]);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading((prev) => !prev);
		}
	};

	useEffect(() => {
		sessionStorage.setItem("whys_selected_statement", statement);
		sessionStorage.setItem("whys_venn", JSON.stringify(venn));
		sessionStorage.setItem("selected_whys", JSON.stringify(fiveWhys));
		sessionStorage.setItem("five_whys", JSON.stringify(fiveWhys));
		sessionStorage.setItem("statement_id", statement_id);
	}, [statement, venn, selectedWhys, fiveWhys, statement_id]);

	const handleShowPopup = () => {
		setIsPopupOpen(true);
	};

	const handleClosePopup = () => {
		setIsPopupOpen(false);
	};

	const addWhysToList = (why) => {
		if (selectedWhys !== null) {
			if (!selectedWhys.includes(why)) {
				return setSelectedWhys((curr) => [...curr, why]);
			} else {
				return setSelectedWhys(
					selectedWhys.filter((whys) => whys !== why)
				);
			}
		}
		return setSelectedWhys((prev) => [...prev, ...why]);
	};

	const generatePotentialRootProb = async () => {
		setIsLoading((prev) => !prev);
		try {
			let token = localStorage.getItem("token");
			let response = await axiosInstance.post(
				`/api/ai/potential_root/`,
				{
					selected_statement: statement,
					list_of_whys: [...fiveWhys],
				},
				{
					headers: { Authorization: `Token ${token}` },
				}
			);
			// console.log(response.data);
			sessionStorage.setItem("root_five_whys", JSON.stringify(fiveWhys));
			// console.log("Venn in fivewhys: ", venn);
			navigate("/hmw", {
				state: {
					potential_root: response.data,
					statement_id: statement_id,
					venn: venn,
					statement: statement,
					list_of_whys: [...fiveWhys],
				},
			});
		} catch (err) {
			console.error(err);
		} finally {
			sessionStorage.removeItem("selected_whys");
			sessionStorage.removeItem("selected_hmws");
			sessionStorage.removeItem("five_hmws");
			sessionStorage.removeItem("elevatorPitch");
			setIsLoading((prev) => !prev);
		}
	};

	return (
		<Box>
			{isLoading ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}>
					<LoadingScreen />
				</Box>
			) : (
				<Box
					sx={{
						px: 12,
						py: 2,
						width: "90%",
						margin: "auto",
						maxWidth: "1000px",
					}}>
					<Typography
						variant="h1"
						textAlign={"center"}
						fontSize="50px">
						5 Whys
					</Typography>
					<Typography
						variant="body1"
						textAlign={"center"}
						width="800px"
						margin="auto"
						marginBottom={"50px"}
						marginTop="10px">
						Now subject the selected problem statement to a 5-Why
						analysis. In 5-Whys, you ask "why" five times to uncover
						the underlying issue behind a problem. Click the
						generate button to generate a 5 whys statement
					</Typography>
					{/* Top Part */}
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h4">
								Selected Problem Statement
							</Typography>
							<Box sx={{ mt: 3, ml: 7 }}>
								<Typography
									variant="body3"
									sx={{
										fontSize: "1rem",
										fontWeight: "bold",
									}}>
									Below, is your selected ranked problem
									statement.
								</Typography>

								<Card
									variant="outlined"
									sx={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										border: "1px solid #8e8e8e",
										borderRadius: 4,
										boxShadow: "none",
										margin: "auto",
									}}>
									<CardContent
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
										}}>
										<Typography
											variant="body3"
											style={{ color: "black" }}>
											{statement}
										</Typography>
									</CardContent>
									<CardActions>
										<Button
											variant="contained"
											sx={{
												borderRadius: 5,
												color: "#FFFF",
											}}
											onClick={handleShowPopup}>
											Show
										</Button>
									</CardActions>
								</Card>

								<Box
									sx={{
										display: "flex",
										flexDirection: "row-reverse",
										mt: 2,
									}}>
									<Button
										variant="contained"
										disabled={
											statement === "" ? true : false
										}
										onClick={() =>
											generateFiveWhys(statement)
										}
										sx={{
											height: "50px",
											borderRadius: 5.6,
											color: "#FFFF",
										}}>
										Generate Whys
									</Button>
								</Box>
							</Box>
						</Grid>
					</Grid>

					{/* Bottom Part */}
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant="h4">
								Generated 5 Why's
							</Typography>
							<Box sx={{ mt: 1, ml: 7 }}>
								<Box>
									<Typography
										variant="body1"
										textAlign={"justify"}
										style={{ color: "black" }}>
										In this section, ElevateMe will generate
										five "Whys" based on the provided
										problem statement. Each "Why" can be
										adjusted to suit the user's needs. By
										clicking the check icons, subsequent
										"Whys" will automatically update to
										reflect the changes. These five "Whys"
										will then help identify potential root
										causes of the problem.
									</Typography>
									<Box sx={{ my: 5 }}>
										<Box>
											{fiveWhys.map((value, index) => (
												<Box sx={{ mt: 2 }}>
													<WhysCard
														key={index}
														index={index}
														value={value}
														addWhysToList={
															addWhysToList
														}
														setFiveWhys={
															setFiveWhys
														}
														modifyFiveWhys={
															modifyFiveWhys
														}
													/>
												</Box>
											))}
											<Box
												sx={{
													display: "flex",
													justifyContent: "flex-end",
													mt: 3,
												}}>
												<Button
													variant="contained"
													disabled={
														fiveWhys.length === 0
													}
													onClick={
														generatePotentialRootProb
													}
													sx={{
														px: 2.3,
														py: 1.2,
														borderRadius: 5.6,
														color: "#FFFF",
														height: "50px",
													}}>
													Generate Root
												</Button>
											</Box>
										</Box>
									</Box>
								</Box>
							</Box>
						</Grid>
					</Grid>
					{isPopupOpen && (
						<PopupVennHistory
							venn={venn}
							open={isPopupOpen}
							onClose={handleClosePopup}
						/>
					)}
				</Box>
			)}
		</Box>
	);
};

export default FiveWhys;

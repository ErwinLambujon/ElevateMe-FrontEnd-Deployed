import { Box, Button, Card, Grid, IconButton, Typography } from "@mui/material";

import PSCard from "../components/PSCard";
import SettingsIcon from "@mui/icons-material/Settings";
import Venn2 from "../res/venn2.png";
import Venn3 from "../res/venn.png";
import { useEffect, useReducer, useState } from "react";
import VennSettings from "../components/VennSettings";
import axiosInstance from '../helpers/axios';
import LoadingScreen from "../components/LoadingScreen";
import GridBackground from "../res/gridbackground.png";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircleUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"; 
import CircleCheckedIcon from "@mui/icons-material/CheckCircleOutline"; 
import zIndex from "@mui/material/styles/zIndex";
import { useLocation } from "react-router-dom";
import { TextField } from "@mui/material/TextField";
import { API_BASE_URL } from "../helpers/constant";

function problemStatementDispatch(state, action) {
	switch (action.type) {
		case "SET_PROBLEM_STATEMENT":
			return [...action.ps_list];
		case "SAVE_PROBLEM_STATEMENT":
			return state.filter((item) => item !== action.statement);
		default:
			return [...state];
	}
}

function checkFields(textFields, selectedButton) {
	if (
		(textFields.field1 === null ||
			textFields.field2 === null ||
			textFields.field3 === null ||
			textFields.field1 === "" ||
			textFields.field2 === "" ||
			textFields.field3 === "") &&
		selectedButton === 3
	) {
		return false;
	} else if (
		(textFields.field1 === null ||
			textFields.field2 === null ||
			textFields.field1 === "" ||
			textFields.field2 === "") &&
		selectedButton === 1
	) {
		return false;
	}
	return true;
}

function Venn() {
	const location = useLocation();
	const venn = location.state ? location.state.venn : undefined;
	const setting = location.state ? location.state.setting : undefined;

	const [showSetting, setShowSetting] = useState(false);
	const [textFields, setTextFields] = useState({
		field1: venn?.field1 || sessionStorage.getItem("field1") || "",
		field2: venn?.field2 || sessionStorage.getItem("field2") || "",
		field3: venn?.field3 || sessionStorage.getItem("field3") || "",
		filter: venn?.filter || sessionStorage.getItem("filter") || "",
	});

	const [ProblemStatements, dispatch] = useReducer(
		problemStatementDispatch,
		JSON.parse(sessionStorage.getItem("generated_PS"))
	);
	const [isLoading, setIsLoading] = useState(false);
	const getLastCheckButton = sessionStorage.getItem("setting");
	const [selectedButton, setSelectedButton] = useState(
		setting || (getLastCheckButton !== null ? parseInt(getLastCheckButton) : 3)
	);

	const handleButtonClick = (buttonValue) => {
		setSelectedButton(buttonValue);
		sessionStorage.setItem("setting", buttonValue);
	};

	const [selectedCheckButton, setSelectedCheckButton] = useState([
		false,
		false,
		false,
	]);

	const [groupLabel, setgroupLabel] = useState(null);

	const toggleShowSetting = () => {
		setShowSetting((prevState) => !prevState);
	};

	const handleTextFieldChange = (event) => {
		const { name, value } = event.target;
		setTextFields((prevState) => {
			const newState = { ...prevState, [name]: value };
			return newState;
		});
	};

	// NOTE(Franz) : Used only for debugging
	useEffect(() => {
		sessionStorage.setItem("generated_PS", JSON.stringify(ProblemStatements));
	}, [ProblemStatements]);

	useEffect(() => {
		const generateProblemStatement = async () => {
			try {
				setIsLoading((prev) => !prev);
				let token = localStorage.getItem("token");
				let response = await axiosInstance.post(
					`/api/ai/two_venn/`,
					{
						...groupLabel,
					},
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
				dispatch({
					type: "SET_PROBLEM_STATEMENT",
					ps_list: response.data.response,
				});
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading((prev) => !prev);
			}
		};

		if (groupLabel) {
			generateProblemStatement();
		}
	}, [groupLabel]);

	useEffect(() => {
		sessionStorage.setItem("field1", textFields.field1);
		sessionStorage.setItem("field2", textFields.field2);
		sessionStorage.setItem("field3", textFields.field3);
		sessionStorage.setItem("filter", textFields.filter);
	}, [textFields]);

	const handleSelectCheckBox = async (index) => {
		console.log(index);
		if (index === 0) {
			if (
				textFields.field1 === null ||
				textFields.field1 === "" ||
				textFields.field2 === null ||
				textFields.field2 === ""
			) {
				alert(
					"Cannot generate statement as one of the required fields is empty."
				);
				return;
			}
		} else if (index === 1) {
			// console.log(textFields);
			if (
				textFields.field1 === null ||
				textFields.field3 === "" ||
				textFields.field3 === null ||
				textFields.field3 === ""
			) {
				alert(
					"Cannot generate statement as one of the required fields is empty."
				);
				return;
			}
		} else if (index === 2) {
			if (
				textFields.field2 === null ||
				textFields.field2 === "" ||
				textFields.field3 === null ||
				textFields.field3 === ""
			) {
				alert(
					"Cannot generate statement as one of the required fields is empty."
				);
				return;
			}
		}
		setSelectedCheckButton((prev) => {
			return prev.map((value, i) => (i === index ? true : false));
		});

		// First group which is field1 and field2
		if (index === 0) {
			console.log(groupLabel);
			setgroupLabel({
				field1: textFields.field1,
				field2: textFields.field2,
				filter: textFields.filter,
			});
		} else if (index === 1) {
			setgroupLabel({
				field1: textFields.field1,
				field2: textFields.field3,
				filter: textFields.filter,
			});
		} else if (index === 2) {
			setgroupLabel({
				field1: textFields.field2,
				field2: textFields.field3,
				filter: textFields.filter,
			});
		}

		// console.log(groupLabel);
		try {
			setIsLoading((prev) => !prev);
			let token = localStorage.getItem("token");
			let response = await axiosInstance.post(
				`/api/ai/two_venn/`,
				{
					...groupLabel,
				},
				{
					headers: { Authorization: `Token ${token}` },
				}
			);
			dispatch({
				type: "SET_PROBLEM_STATEMENT",
				ps_list: response.data.response,
			});
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading((prev) => !prev);
		}

	};

	const handleGenerateButtonClick = async () => {
		// console.log(selectedCheckButton);
		setIsLoading(true);
		let token = localStorage.getItem("token");
		try {
			if (selectedButton === 2) {
				if (!checkFields(textFields, selectedButton)) {
					alert("Cannot generate when other fields are empty.");
					return;
				}
				// alert("HERE");
				let two_response = await axiosInstance.post(
					`/api/ai/two_venn/`,
					{
						...textFields,
					},
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
				dispatch({
					type: "SET_PROBLEM_STATEMENT",
					ps_list: two_response.data.response,
				});
				// console.log(two_response.data.response);
			} else if (selectedButton === 3) {
				if (!checkFields(textFields, selectedButton)) {
					alert("Cannot generate when other fields are empty.");
					return;
				}
				let three_response = await axiosInstance.post(
					`/api/ai/three_venn/`,
					{
						...textFields,
					},
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
				setSelectedCheckButton([false, false, false]);
				dispatch({
					type: "SET_PROBLEM_STATEMENT",
					ps_list: three_response.data.response,
				});
			}
		} catch (err) {
			// console.log(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSaveProblemStatement = async (text) => {
		// console.log(selectedButton);
		// console.log(text);
		const hasCheckedCheckBox = selectedCheckButton.some(
			(item) => item === true
		);
		let token = localStorage.getItem("token");
		let response;
		try {
			if (selectedButton === 2) {
				response = await axiosInstance.post(
					`/api/two_venn_ps/`,
					{
						venn: { ...textFields },
						statement: text,
					},
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
			} else if (selectedButton === 3) {
				// console.log(hasCheckedCheckBox);
				if (hasCheckedCheckBox) {
					response = await axiosInstance.post(
						`/api/two_venn_ps/`,
						{
							venn: { ...groupLabel },
							statement: text,
						},
						{
							headers: { Authorization: `Token ${token}` },
						}
					);
				} else {
					response = await axiosInstance.post(
						`/api/three_venn_ps/`,
						{
							venn: { ...textFields },
							statement: text,
						},
						{
							headers: { Authorization: `Token ${token}` },
						}
					);
				}
			}
			dispatch({
				type: "SAVE_PROBLEM_STATEMENT",
				statement: text,
			});
		} catch (err) {
			// console.log(err);
		}
	};
	return (
		<>
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
					paddingBottom={4}
					sx={{
						backgroundImage: `url(${GridBackground})`,

						backgroundRepeat: "no-repeat",
						marginBottom: "60px",
						backgroundPositionY: "-570px",
					}}>
					<Typography variant="h2" textAlign="center" gutterBottom>
						Venn Diagram
					</Typography>
					<Grid
						container
						spacing={6}
						justifyContent="center"
						alignItems="center">
						{/* Venn Scopes section card */}
						<Grid item>
							<Card
								sx={{
									width: 370,
									height: 440,
									p: 3.7,
									borderRadius: 6,
									boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 35px 10px",
								}}>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											mb: 2,
											width: "100%",
										}}>
										<Box width={200}>
											<Typography variant="h4">Venn Diagram Scopes</Typography>
										</Box>

										<IconButton
											sx={{
												marginTop: -4,
												marginRight: -1,
												padding: 0,
												height: "40px",
												width: "40px",
											}}
											onClick={toggleShowSetting}>
											<SettingsIcon variant="outlined" sx={{ fontSize: 30 }} />
										</IconButton>
									</Box>

									<Box sx={{ position: "relative", marginBottom: "20px" }}>
										{selectedButton === 3 ? (
											<>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
													}}>
													{/* First Checkbox, placement is unnecessary pero giin ani nalang nako aron naay connection, firstcheckbox:  field1 union field 2*/}
													<FormControlLabel
														control={
															<Checkbox
																edge="start"
																disabled={
																	textFields.field1 === null ||
																	textFields.field1 === "" ||
																	textFields.field2 === null ||
																	textFields.field2 === ""
																		? true
																		: false
																}
																// indeterminate={!textFields.field1 &&textFields.field2}
																checked={selectedCheckButton[0]}
																icon={<CircleUncheckedIcon />}
																checkedIcon={<CircleCheckedIcon />}
																onClick={() => handleSelectCheckBox(0)}
																sx={{
																	position: "absolute",
																	zIndex: 4,
																	marginBottom: "120px",
																	marginLeft: "170px",
																}}
															/>
														}
													/>

													{/* Label for the first Checkbox using Typography */}
													<Typography
														variant="body1"
														sx={{
															position: "absolute",
															top: "72px",
															left: "24px",
															color: "#8E8E8E",
															fontSize: "14px",
															width: "81px",
															textAlign: "center",
															overflow: "hidden",
															display: "-webkit-box",
															WebkitLineClamp: 3,
															WebkitBoxOrient: "vertical",
														}}>
														{textFields.field1
															? textFields.field1
															: "Field 1..."}
													</Typography>

													{/* Second Checkbox: field 1 union field 3 */}
													<FormControlLabel
														control={
															<Checkbox
																edge="start"
																disabled={
																	textFields.field1 === null ||
																	textFields.field3 === "" ||
																	textFields.field3 === null ||
																	textFields.field3 === ""
																		? true
																		: false
																}
																checked={selectedCheckButton[1]}
																// indeterminate={!textFields.field1 &&textFields.field3}
																icon={<CircleUncheckedIcon />}
																checkedIcon={<CircleCheckedIcon />}
																onClick={() => handleSelectCheckBox(1)}
																sx={{
																	position: "absolute",
																	zIndex: 4,
																	marginTop: "10px",
																	marginLeft: "120px",
																}}
															/>
														}
													/>

													{/* Label for the second Checkbox using Typography */}
													<Typography
														variant="body1"
														sx={{
															position: "absolute",
															top: "72px",
															right: "35px",
															color: "#8E8E8E",
															fontSize: "14px",
															width: "81px",
															textAlign: "center",
															overflow: "hidden",
															display: "-webkit-box",
															WebkitLineClamp: 3,
															WebkitBoxOrient: "vertical",
														}}>
														{textFields.field2
															? textFields.field2
															: "Field 2..."}
													</Typography>

													{/* Third Checkbox: field 2 union field 3 */}
													<FormControlLabel
														control={
															<Checkbox
																edge="start"
																// indeterminate={!textFields.field2 &&textFields.field3}
																icon={<CircleUncheckedIcon />}
																checked={selectedCheckButton[2]}
																checkedIcon={<CircleCheckedIcon />}
																onClick={() => handleSelectCheckBox(2)}
																disabled={
																	textFields.field2 === null ||
																	textFields.field2 === "" ||
																	textFields.field3 === null ||
																	textFields.field3 === ""
																		? true
																		: false
																}
																sx={{
																	position: "absolute",
																	zIndex: 1,
																	marginTop: "10px",
																	marginLeft: "200px",
																}}
															/>
														}
													/>

													{/* Label for the third Checkbox using Typography */}
													<Typography
														variant="body1"
														sx={{
															position: "absolute",
															bottom: "50px",
															left: "50%",
															transform: "translate(-50%)",
															color: "#8E8E8E",
															fontSize: "14px",
															width: "81px",
															textAlign: "center",
															overflow: "hidden",
															display: "-webkit-box",
															WebkitLineClamp: 3,
															WebkitBoxOrient: "vertical",
														}}>
														{textFields.field3
															? textFields.field3
															: "Field 3..."}
													</Typography>

													{/* Venn Diagram Image */}
													<img
														src={Venn3}
														alt="Venn Diagram"
														style={{
															zIndex: 0,
															width: "325px",
															height: "auto",
														}}
													/>
												</Box>
											</>
										) : (
											<>
												<Box
													sx={{
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
														flexDirection: "column",
													}}>
													<Typography
														variant="h6"
														sx={{
															position: "absolute",
															top: "110px",
															left: "24px",
															color: "#8E8E8E",
															fontSize: "14px",
															width: "81px",
															textAlign: "center",
															overflow: "hidden",
															display: "-webkit-box",
															WebkitLineClamp: 3,
															WebkitBoxOrient: "vertical",
														}}>
														{textFields.field1
															? textFields.field1
															: "Field 1..."}
													</Typography>

													<Typography
														variant="h6"
														sx={{
															position: "absolute",
															top: "110px",
															right: "35px",
															color: "#8E8E8E",
															fontSize: "14px",
															width: "81px",
															textAlign: "center",
															overflow: "hidden",
															display: "-webkit-box",
															WebkitLineClamp: 3,
															WebkitBoxOrient: "vertical",
														}}>
														{textFields.field2
															? textFields.field2
															: "Field 2..."}
													</Typography>
												</Box>

												<img
													src={Venn2}
													alt="Venn Diagram"
													style={{
														zIndex: 0,
														marginTop: "40px",
														width: "325px",
														height: "auto",
														display: "block",
													}}
												/>
											</>
										)}
									</Box>
								</Box>
							</Card>
						</Grid>
						<Grid item>
							<Box sx={{ marginLeft: 4, width: "360px" }}>
								<Typography variant="h3">
									Problem Statement Generator
								</Typography>
								<Typography variant="body1" sx={{ mt: 2 }}>
									Specify first the number of Venn Diagram and Input the scopes
									of your problem statement you want to be generated
								</Typography>
								<Button
									onClick={handleGenerateButtonClick}
									variant="contained"
									disabled={
										setting === 2
											? textFields.field1 === "" && textFields.field2 === ""
												? true
												: false
											: textFields.field1 === "" &&
											  textFields.field2 === "" &&
											  textFields.field3 === ""
									}
									sx={{
										mt: 4.3,
										py: 1.3,
										px: 6.2,
										borderRadius: 5.6,
										color: "#FFFB",
										fontSize: "1rem",
									}}>
									Generate
								</Button>
							</Box>
						</Grid>
					</Grid>
					<Box sx={{ mt: 16, px: 15 }}>
						<Typography variant="h3" textAlign={"center"}>
							Generated Problem Statement
						</Typography>
						<Typography variant="body1" textAlign={"center"} marginTop={2.7}>
							Here are the generated problem statements from the given scopes:
						</Typography>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="left"
							gap={2}
							sx={{ mt: 2, mb: 4 }}>
							{Array.isArray(ProblemStatements) &&
								ProblemStatements.map((text, index) => (
									<PSCard
										key={index}
										text={text}
										handleSaveProblemStatement={handleSaveProblemStatement}
									/>
								))}
						</Box>
					</Box>
					{showSetting && (
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								zIndex: 300,
							}}>
							<Box sx={{ position: "relative" }}>
								<VennSettings
									toggleShowSetting={toggleShowSetting}
									textFields={textFields}
									setTextFields={setTextFields}
									selectedButton={selectedButton}
									setSelectedButton={setSelectedButton}
									sx={{ zIndex: 1000 }}
								/>
							</Box>
						</Box>
					)}
				</Box>
			)}
		</>
	);
}

export default Venn;

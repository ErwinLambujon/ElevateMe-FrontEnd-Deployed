import {
	Box,
	Typography,
	RadioGroup,
	FormControlLabel,
	Radio,
	Card,
	CardContent,
	Grid,
	IconButton,
	FormControl,
	Select,
	MenuItem,
	Button,
} from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import PSListCard from "../components/RankingPSCard";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axiosInstance from '../helpers/axios';
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { API_BASE_URL } from "../helpers/constant";
import { Visibility } from "@mui/icons-material";

const PS_action = {
	SET_PROBLEM_STATEMENT: "SET_PROBLEM_STATEMENT",
	REMOVE_PROBLEM_STATEMENT: "REMOVE_PROBLEM_STATEMENT",
	MODIFY_PROBLEM_STATEMENT: "MODIFY_PROBLEM_STATEMENT",
};

function listProblemStatementReducer(state, action) {
	switch (action.type) {
		case PS_action.SET_PROBLEM_STATEMENT:
			const statements = action.statements;
			const queuedStatements = action.queuedProblemStatement;
			const filteredStatements = statements.filter(
				(statement) =>
					!queuedStatements.some(
						(queuedStatement) =>
							queuedStatement.statement === statement.statement
					)
			);
			return [...filteredStatements];
		case PS_action.REMOVE_PROBLEM_STATEMENT:
			return state.filter(
				(item) => item.statement !== action.payload.statement
			);
		case PS_action.MODIFY_PROBLEM_STATEMENT:
			const newState = [...state];
			newState.splice(action.index, 0, {
				id: action.payload.id,
				venn: action.payload.venn,
				statement: action.payload.statement,
			});
			// console.log(newState);
			return newState;
		default:
			return state;
	}
}

function queuedProblemStatementReducer(state, action) {
	switch (action.type) {
		case PS_action.SET_PROBLEM_STATEMENT:
			return action.statement || [];
		case "ADD_PROBLEM_STATEMENT":
			return [
				...state,
				{
					id: action.payload.id,
					venn: action.payload.venn,
					statement: action.payload.statement,
				},
			];
		case PS_action.REMOVE_PROBLEM_STATEMENT:
			return state.filter((item) => {
				return item.statement !== action.payload.statement;
			});
		default:
			return state;
	}
}

const criteria = [
	{
		criteria_title: "Impact",
		description:
			"The problem has a significant impact on various stakeholders, such as individuals, groups, organizations, and the environment.",
	},
	{
		criteria_title: "Capability",
		description:
			"The problem solver has the ability to effectively address and solve this problem based on your skills, resources, and expertise.",
	},
	{
		criteria_title: "Development Cost",
		description:
			"The potential solution is feasible to develop considering potential costs, investments, and financial resources required.",
	},
	{
		criteria_title: "Urgency",
		description:
			"It is urgent to find a solution for this problem in terms of time constraints, market demands, or immediate needs.",
	},
	{
		criteria_title: "Innovation Opportunity",
		description:
			"The problem has the potential to present innovative solutions or new approaches that could lead to unique outcomes or competitive advantages.",
	},
	{
		criteria_title: "Market Size",
		description:
			"Potential market is large enough to make the solution a viable business.",
	},
];

const Ranking = () => {
	const [listProblemStatement, listProblemStatementDispatch] = useReducer(
		listProblemStatementReducer,
		JSON.parse(sessionStorage.getItem("ranking_list_statements")) || []
	);

	const [queuedProblemStatement, queuedProblemStatementDispatch] = useReducer(
		queuedProblemStatementReducer,
		[]
	);

	const [selectedButton, setSelectedButton] = useState(3);
	const navigate = useNavigate();

	const [selectedValues, setSelectedValues] = useState(
		JSON.parse(sessionStorage.getItem("ranking_selectedValues")) || []
	);
	const [totalsPerRow, setTotalsPerRow] = useState(
		JSON.parse(sessionStorage.getItem("ranking_totalsPerRow")) || []
	);

	const handleSelectChange = (rowIndex, colIndex, newValue) => {
		const newSelectedValues = selectedValues.map((row, rIdx) =>
			row.map((value, cIdx) =>
				rIdx === rowIndex && cIdx === colIndex ? newValue : value
			)
		);
		setSelectedValues(newSelectedValues);

		const newTotalsPerRow = newSelectedValues.map((row) =>
			row.reduce((sum, value) => sum + value, 0)
		);
		setTotalsPerRow(newTotalsPerRow);
	};

	useEffect(() => {
		sessionStorage.setItem(
			"ranking_selectedValues",
			JSON.stringify(selectedValues)
		);
		sessionStorage.setItem(
			"ranking_totalsPerRow",
			JSON.stringify(totalsPerRow)
		);
	}, [selectedValues, totalsPerRow]);

	const getRanks = (totals) => {
		const indexedTotals = totals.map((total, index) => ({ total, index }));
		indexedTotals.sort((a, b) => b.total - a.total || a.index - b.index);
		const ranks = Array(totals.length).fill(0);
		indexedTotals.forEach((item, rank) => {
			ranks[item.index] = rank + 1;
		});
		return ranks;
	};

	const ranks = getRanks(totalsPerRow);

	useEffect(() => {
		const getSavedPS = async () => {
			setIsLoading(true);
			try {
				if (selectedButton === 2) {
					let token = localStorage.getItem("token");

					let response = await axiosInstance.get(
						`/api/two_venn_ps/`,
						{
							headers: { Authorization: `Token ${token}` },
						}
					);

					listProblemStatementDispatch({
						type: PS_action.SET_PROBLEM_STATEMENT,
						statements: response.data,
						queuedProblemStatement: queuedProblemStatement, // Pass the queuedProblemStatement state
					});
				} else if (selectedButton === 3) {
					let token = localStorage.getItem("token");

					let response = await axiosInstance.get(
						`/api/three_venn_ps/`,
						{
							headers: { Authorization: `Token ${token}` },
						}
					);


					listProblemStatementDispatch({
						type: PS_action.SET_PROBLEM_STATEMENT,
						statements: response.data,
						queuedProblemStatement: queuedProblemStatement, // Pass the queuedProblemStatement state
					});
				}
			} catch (err) {
			} finally {
				setIsLoading(false);
			}
		};

		getSavedPS();
		setSelectedValues([...[...initialSelectedValues]]);
		setTotalsPerRow([...initialTotalsPerRow]);
	}, [selectedButton]);

	const initialSelectedValues = queuedProblemStatement?.map(() =>
		criteria.map(() => 1)
	);
	const initialTotalsPerRow = initialSelectedValues.map((row) => {
		return row.reduce((sum, value) => sum + value);
	});

	useEffect(() => {
		sessionStorage.setItem(
			"ranking_list_statements",
			JSON.stringify(listProblemStatement)
		);
		sessionStorage.setItem(
			"ranking_queued_list_statements",
			JSON.stringify(queuedProblemStatement)
		);
		setSelectedValues((prev) => {
			return [...prev, ...[[1, 1, 1, 1, 1, 1]]];
		});
		setTotalsPerRow((prev) => [...prev, ...initialTotalsPerRow]);
	}, [queuedProblemStatement, listProblemStatement]);

	const handleAddStatement = (id, venn, statement) => {
		queuedProblemStatementDispatch({
			type: "ADD_PROBLEM_STATEMENT",
			payload: {
				id: id,
				venn: venn,
				statement: statement,
			},
		});

		listProblemStatementDispatch({
			type: PS_action.REMOVE_PROBLEM_STATEMENT,
			payload: {
				id: id,
				venn: venn,
				statement: statement,
			},
		});
	};
	const removeSelectedStatement = (index, id, venn, statement) => {
		queuedProblemStatementDispatch({
			type: PS_action.REMOVE_PROBLEM_STATEMENT,
			index: index,
			payload: {
				id: id,
				venn: venn,
				statement: statement,
			},
		});

		const newSelectedValues = selectedValues.filter((_, i) => i !== index);
		setSelectedValues(newSelectedValues);

		const newTotalsPerRow = newSelectedValues.map((row) =>
			row.reduce((sum, value) => sum + value, 0)
		);
		setTotalsPerRow(newTotalsPerRow);

		listProblemStatementDispatch({
			type: PS_action.MODIFY_PROBLEM_STATEMENT,
			index: index,
			payload: {
				id: id,
				venn: venn,
				statement: statement,
			},
		});
	};

	const generatePotenialRootProblem = (id, venn, statement) => {
		if (queuedProblemStatement.length <= 1) {
			alert("Cannot proceed with only 1 ranked statement.");
			return;
		}
		sessionStorage.removeItem("whys_selected_statement");
		sessionStorage.removeItem("whys_venn");
		sessionStorage.removeItem("selected_whys");
		sessionStorage.removeItem("five_whys");
		sessionStorage.removeItem("selected_hmws");
		sessionStorage.removeItem("five_hmws");
		sessionStorage.removeItem("generated_root");
		sessionStorage.removeItem("root_five_whys");
		sessionStorage.removeItem("selected_statement");
		sessionStorage.removeItem("elevatorPitch");
		navigate("/five_whys", {
			state: { id: id, venn: venn, statement: statement },
		});
	};

	const [isLoading, setIsLoading] = useState(false);
	return (
		<Box pb={5}>
			<Box
				sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
				<Typography variant="h1" sx={{ textAlign: "center", width: "400px" }}>
					Ranking List
				</Typography>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
			<Typography variant="body1" textAlign={"center"} width={"1000px"}>
							Choose a problem statement to be ranked from either the list of saved 2 field venn diagrams or 3 field venn diagram - by clicking the radio button
							2 or 3. Click the + icon to select the problem statement of your choice. When selected, you can now rank that problem statement based on the criteria 
							defined below. After ranking, you can choose what problem statement (by clicking the check icon) you want for the next process -Five whys.

							
						</Typography>

			</Box>
			<Box sx={{ mx: 13.3, mb: 0, mt: 3 }}>
				<Typography variant="h3">Problem Statement List</Typography>
			</Box>

			<Box sx={{ mx: 17 }}>
				<Box sx={{ display: "flex", justifyContent: "end" }}>
					<RadioGroup
						value={selectedButton}
						onChange={(e) => {
							const value = +e.target.value;
							sessionStorage.setItem("ranking_selected_button", value);
							setSelectedButton((prev) => (prev = value));
							queuedProblemStatementDispatch({
								type: PS_action.SET_PROBLEM_STATEMENT,
								statement: [],
							});
						}}
						name="radio-button-group"
						sx={{ flexDirection: "row" }}>
						<FormControlLabel value="2" control={<Radio />} label="2" />
						<FormControlLabel value="3" control={<Radio />} label="3" />
					</RadioGroup>
				</Box>
				<Box
					sx={{
						minHeight: "300px",
						maxHeight: "500px",
						overflowY: "auto",
						mt: 2,
						mb: 4,
						p: 1.3,
					}}>
					{isLoading ? (
						<>
							<LoadingScreen />
						</>
					) : (
						<>
							{listProblemStatement.map((item, id) => (
								<Box key={id} sx={{ mb: 1 }}>
									<PSListCard
										key={id}
										{...item}
										addStatement={handleAddStatement}
									/>
								</Box>
							))}
						</>
					)}
				</Box>
			</Box>

			<Box sx={{ mx: 13.3, mb: 3 }}>
				<Typography variant="h3">Problem Statement Ranking</Typography>
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					mx: 17,
					mb: 7,
				}}>
				{criteria.map(({ criteria_title, description }, index) => (
					<Box
						key={index}
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
							minHeight: "50px",
							backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
							borderRadius: 2.5, // Rounded corners
							padding: 0.5, // Add some padding
							boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add a subtle box shadow
						}}>
						<Box
							sx={{
								backgroundColor: "primary.main", // Use the primary color for the bullet
								width: 10,
								height: 10,
								marginLeft: 1,
								borderRadius: "50%", // Make the bullet a circle
							}}
						/>
						<Typography
							variant="body1"
							sx={{ fontWeight: "bold", minWidth: "180px", maxWidth: "180px" }}>
							{criteria_title}:
						</Typography>
						<Typography variant="body1" sx={{ alignItems: "center" }}>
							{description}
						</Typography>
					</Box>
				))}
			</Box>

			<Box sx={{ mr: 14, ml: 17, mb: 2 }}>
				<Box sx={{ display: "flex", mb: 2 }}>
					<IconButton sx={{ visibility: "hidden" }}>
						<CheckCircleOutlineIcon />
					</IconButton>
					<Card
						sx={{
							background: "#D9D9D9",
							borderRadius: 5,
							width: "100%",
						}}>
						<CardContent
							sx={{
								display: "flex",
								borderRadius: 5,
								width: "100%",
							}}>
							<Grid
								container
								sx={{ justifyContent: "space-between" }}
								spacing={0}>
								<Grid item xs={4}>
									<Typography sx={{ textAlign: "center" }}>
										Problem Statement
									</Typography>
								</Grid>
								<Grid item xs>
									<Typography textAlign={"center"}>Impact</Typography>
								</Grid>
								<Grid item xs>
									<Typography textAlign={"center"}>Capability</Typography>
								</Grid>
								<Grid item xs>
									<Typography textAlign={"center"}>Dev Cost</Typography>
								</Grid>
								<Grid item xs>
									<Typography sx={{ textAlign: "center" }}>
										Urgency of Needs
									</Typography>
								</Grid>
								<Grid item xs>
									<Typography textAlign={"center"}>
										Innovation Opportunity
									</Typography>
								</Grid>
								<Grid item xs textAlign={"center"}>
									<Typography>Market Size</Typography>
								</Grid>
								<Grid item xs textAlign={"center"}>
									<Typography>Total</Typography>
								</Grid>
								<Grid item xs textAlign={"center"}>
									<Typography>Rank</Typography>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
					<IconButton sx={{ visibility: "hidden" }}>
						<CheckCircleOutlineIcon />
					</IconButton>
				</Box>

				{queuedProblemStatement.length > 0 &&
					selectedValues.length > 0 &&
					queuedProblemStatement.map(({ id, venn, statement }, rowIndex) => (
						<Box key={rowIndex} sx={{ display: "flex", mb: 2 }}>
							<IconButton
								onClick={() => {
									generatePotenialRootProblem(id, venn, statement);
								}}>
								<CheckCircleOutlineIcon />
							</IconButton>
							<Card
								sx={{
									background: "#D9D9D9",
									borderRadius: 5,
								}}>
								<CardContent
									sx={{
										display: "flex",
										borderRadius: 5,
										width: "100%",
									}}>
									<Grid
										container
										sx={{ justifyContent: "space-between" }}
										spacing={0}>
										<Grid
											item
											xs={4}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}>
											<Typography variant="body1" align="center">
												{statement}
											</Typography>
										</Grid>
										{criteria.map((_, colIndex) => (
											<Grid
												key={colIndex}
												item
												xs
												sx={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
												}}>
												<FormControl>
													<Select
														required
														value={selectedValues[rowIndex][colIndex]}
														onChange={(e) =>
															handleSelectChange(
																rowIndex,
																colIndex,
																parseInt(e.target.value)
															)
														}>
														<MenuItem value={1}>1</MenuItem>
														<MenuItem value={2}>2</MenuItem>
														<MenuItem value={3}>3</MenuItem>
														<MenuItem value={4}>4</MenuItem>
														<MenuItem value={5}>5</MenuItem>
													</Select>
												</FormControl>
											</Grid>
										))}

										<Grid
											item
											xs
											sx={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}>
											<Typography>{totalsPerRow[rowIndex]}</Typography>
										</Grid>
										<Grid
											item
											xs
											sx={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}>
											<Typography>{ranks[rowIndex]}</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
							<IconButton
								onClick={() =>
									removeSelectedStatement(rowIndex, id, venn, statement)
								}>
								<DeleteOutlineIcon fontSize={"medium"} color="error" />
							</IconButton>
						</Box>
					))}
			</Box>
		</Box>
	);
};

export default Ranking;

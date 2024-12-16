import React, { useEffect, useMemo, useReducer, useState } from "react";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import SavedPSCard from "../components/SavedPSCard";
import axiosInstance from '../helpers/axios';
import LoadingScreen from "../components/LoadingScreen";
import { API_BASE_URL } from '../helpers/constant';


function problemStatementReducer(state, action) {
	switch (action.type) {
		case "SET_TWO_VENN":
			return { ...state, two_venn: action.statements };
		case "SET_THREE_VENN":
			return { ...state, three_venn: action.statements };
		case "DELETE_TWO_VENN":
			const {
				[action.id]: discardedTwoStatementValue,
				...deletedStatementTwoVenn
			} = state.two_venn;
			return { ...state, two_venn: deletedStatementTwoVenn };
		case "DELETE_THREE_VENN":
			const {
				[action.id]: discardedThreeStatementValue,
				...deletedStatementThreeVenn
			} = state.three_venn;
			return { ...state, three_venn: deletedStatementThreeVenn };
		case "UPDATE_TWO_VENN_STATEMENT":
			const updatedTwoVenn = { ...state.two_venn };
			updatedTwoVenn[action.payload.id] = {
				...updatedTwoVenn[action.payload.id],
				statement: action.payload.statement,
			};
			return { ...state, two_venn: updatedTwoVenn };
		case "UPDATE_THREE_VENN_STATEMENT":
			const updatedThreeVen = { ...state.three_venn };
			updatedThreeVen[action.payload.id] = {
				...updatedThreeVen[action.payload.id],
				statement: action.payload.statement,
			};
			return { ...state, three_venn: updatedThreeVen };

		default:
			return state;
	}
}
const Saved = () => {
	const [savedProblemStatement, dispatch] = useReducer(
		problemStatementReducer,
		{
			two_venn: {},
			three_venn: {},
		}
	);

	const memoizedMapData = useMemo(() => {
		return (data) => {
			return mapData(data);
		};
	}, []);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getSavedProblemStatement = async () => {
			setLoading((prev) => !prev);
			try {
				let token = localStorage.getItem("token");

				let response1 = await axiosInstance.get(
					`/api/two_venn_ps/`,
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
				dispatch({
					type: "SET_TWO_VENN",
					statements: memoizedMapData(response1.data),
				});

				let response = await axiosInstance.get(
					`/api/three_venn_ps/`,
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
				dispatch({
					type: "SET_THREE_VENN",
					statements: memoizedMapData(response.data),
				});
			} catch (err) {
				// console.log("Error fetching saved problem statements:", err);
			} finally {
				setLoading((prev) => !prev);
			}
		};

		getSavedProblemStatement();
	}, [memoizedMapData]);

	const mapData = (data) => {
		const newItems = {};
		data.forEach((item) => {
			newItems[item.id] = item;
		});
		return newItems;
	};

	const handleEdit = async (setting, id, statement) => {
		let token = localStorage.getItem("token");
		alert("CLICKED HERE");
		if (setting === 2) {
			try {
				let response = await axiosInstance.put(
					`/api/two_venn_ps/${id}/`,
					{
						statement: statement,
					},
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
				dispatch({
					type: "UPDATE_TWO_VENN_STATEMENT",
					payload: {
						id: id,
						statement: statement,
					},
				});
			} catch (error) {}
		} else if (setting === 3) {
			try {
				let response = await axiosInstance.put(
					`/api/three_venn_ps/${id}/`,
					{
						statement: statement,
					},
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
				// console.log(response);
				dispatch({
					type: "UPDATE_THREE_VENN_STATEMENT",
					payload: {
						id: id,
						statement: statement,
					},
				});
			} catch (err) {
				// console.log(err);
			}
		}
	};

	const handleDelete = async (setting, id) => {
		if (setting === 2) {
			try {
				let token = localStorage.getItem("token");
				await axiosInstance.delete(`/api/two_venn_ps/${id}/`, {
					headers: { Authorization: `Token ${token}` },
				});
				dispatch({ type: "DELETE_TWO_VENN", id });
			} catch (err) {
				// console.log("Error deleting problem statement:", err);
			}
		} else if (setting === 3) {
			try {
				let token = localStorage.getItem("token");
				await axiosInstance.delete(`/api/three_venn_ps/${id}/`, {
					headers: { Authorization: `Token ${token}` },
				});
				dispatch({ type: "DELETE_THREE_VENN", id });
			} catch (err) {
				// console.log("Error deleting problem statement:", err);
			}
		}
	};

	return (
		<Box>
			{loading ? (
				<LoadingScreen />
			) : (
				<Box sx={{ paddingTop: 4, paddingBottom: 5 }}>
					<Typography variant="h2" textAlign={"center"}>
						Saved List
					</Typography>
					<br></br>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Typography variant="body1" textAlign={"center"} width={"1000px"}>
							This pages stores all the problem statements that you want to
							save. You Can edit with the show button. the section is divided in
							to two categories. 2 Venn Diagram List and the 3 Venn Diagram List
						</Typography>
					</Box>
					<Box sx={{ mx: 13 }}>
						<Typography variant="h4" sx={{ marginTop: 10 }}>
							2 Venn Diagram List
						</Typography>
						<Box sx={{ marginTop: 5, overflowY: "auto", maxHeight: "500px" }}>
							{Object.values(savedProblemStatement.two_venn).map((item) => (
								<SavedPSCard
									key={item.id}
									{...item}
									setting={2}
									onDelete={handleDelete}
									onEdit={handleEdit}
								/>
							))}
						</Box>
					</Box>
					<Box sx={{ mx: 13 }}>
						<Typography variant="h4" sx={{ marginTop: 10 }}>
							3 Venn Diagram List
						</Typography>
						<Box sx={{ marginTop: 5, overflowY: "auto", maxHeight: "500px" }}>
							{Object.values(savedProblemStatement.three_venn).map((item) => (
								<SavedPSCard
									key={item.id}
									{...item}
									onDelete={handleDelete}
									setting={3}
									onEdit={handleEdit}
								/>
							))}
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default Saved;

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Venn3Paper from "../components/venndiagramreport/VennDiagramPaper3";
import Venn2Paper from "../components/venndiagramreport/VennDiagramPaper2";
import { useLocation } from "react-router-dom";
import axiosInstance from "../helpers/axios";
import { Card, CardContent, Grid } from "@mui/material";

const pitch = [
	"For",
	"Who",
	"We Provide",
	"That",
	"Unlike",
	"Who",
	"Our solution",
	"That",
];

const Report = () => {
	const location = useLocation();

	const [details, setDetails] = useState({
		venn: {
			field1: "",
			field2: "",
			field3: "",
			filter: "",
		},
		statement: "",
		potential_root: "",
		whys: [],
		hmws: [],
		elevator_pitch: [],
	});

	console.log("Details: ", details);

	useEffect(() => {
		// console.log(location.state?.list_of_hmws);
		const venn = location.state?.venn ||
			JSON.parse(sessionStorage.getItem("report_venn")) || {
				field1: "",
				field2: "",
				field3: "",
				filter: "",
			};
		// console.log(
		// 	"VENN IN REPORT: ",
		// 	JSON.parse(sessionStorage.getItem("hmw_venn"))
		// );
		const ps_id =
			location.state?.ps_id ??
			sessionStorage.getItem("report_statement_id");
		// console.log("PS ID SESSION STORAGE", ps_id);

		const whys =
			JSON.parse(sessionStorage.getItem("report_whys")) ||
			location.state?.list_of_whys ||
			[];
		const hmws =
			JSON.parse(sessionStorage.getItem("report_hmws")) ||
			location.state?.list_of_hmws ||
			[];

		const potential_root =
			sessionStorage.getItem("report_generated_root") ||
			location.state?.potential_root ||
			"";

		const elevator_pitch =
			JSON.parse(sessionStorage.getItem("report_elevator_pitch")) ||
			location.state?.elevator_pitch ||
			[];

		console.log(location.state?.elevator_pitch);
		const retrieveData = async () => {
			if (ps_id === null) {
				return;
			}
			let response;
			let token = localStorage.getItem("token");
			if (!venn.field3 || venn.field3 === "") {
				response = await axiosInstance.get(
					`/api/two_venn_ps/${ps_id}/`,
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
			} else {
				response = await axiosInstance.get(
					`/api/three_venn_ps/${ps_id}/`,
					{
						headers: { Authorization: `Token ${token}` },
					}
				);
			}
			setDetails((prev) => ({
				...prev,
				whys: [...whys],
				hmws: [...hmws],
				venn: { ...response.data.venn },
				potential_root: potential_root,
				statement: response.data.statement,
				elevator_pitch: elevator_pitch,
			}));

			// console.log("FETCHING THE VENN: ", details);
		};
		if (ps_id !== "null") {
			retrieveData();
		}
		// console.log("PS ID: ", ps_id);
	}, []);

	return (
		<Box sx={{ padding: 4 }}>
			<Typography
				variant="h2"
				sx={{
					fontWeight: "bold",
					textAlign: "center",
					marginBottom: 4,
				}}>
				Report Page
			</Typography>
			<Typography
				variant="body1"
				sx={{ textAlign: "center", marginBottom: 4 }}>
				This page shows the entire process which to be saved as pdf by
				clicking CTRL + P and selecting save as pdf
			</Typography>

			{/* Venn part */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 10,
					width: "60%",
					margin: "auto",
					minWidth: "800px",
					maxWidth: "800px",
				}}>
				{/* Left Div */}
				<Box sx={{ flex: 1 }}>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						height="100%">
						{details.venn &&
						details.venn.field3 !== undefined &&
						details.venn.field3 !== "" ? (
							<Venn3Paper venn={details.venn} />
						) : (
							<Venn2Paper
								venn={
									details.venn || { field1: "", field2: "" }
								}
							/>
						)}
					</Box>
				</Box>

				{/* Right Div */}
				<Box sx={{ flex: 1, marginLeft: 4, alignContent: "center" }}>
					<Typography
						variant="h6"
						sx={{
							fontWeight: "bold",
							marginBottom: 2,
							color: "#186F65",
						}}>
						Problem Statement
					</Typography>
					<Typography variant="body1" sx={{ marginBottom: 4 }}>
						{details.statement}
					</Typography>
				</Box>
			</Box>

			<Grid>
				<Grid item xs={12}>
					<Box
						sx={{
							marginTop: 10,
							marginBottom: 10,
							width: "70%",
							margin: "auto",
							minWidth: "700px",
							maxWidth: "900px",
						}}>
						<Typography
							variant="h5"
							color="#8E8E8E"
							fontSize="18px"
							sx={{
								fontWeight: "bold",
								marginBottom: 0.5,
								color: "#186F65",
							}}>
							Why Statements
						</Typography>
						<Box>
							{Array.isArray(details.whys) &&
								details.whys.length > 0 &&
								details.whys.map((statement, index) => (
									<Paper
										variant="outlined"
										key={index}
										sx={{
											padding: 2,
											marginBottom: 1,
											borderRadius: 4,
											minWidth: "600px",
										}}>
										<Typography variant="body1">
											{statement}
										</Typography>
									</Paper>
								))}
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12}>
					<Box
						sx={{
							marginTop: 10,
							marginBottom: 10,
							width: "70%",
							margin: "auto",
							minWidth: "700px",
							maxWidth: "900px",
						}}>
						<Typography
							variant="h5"
							color="#8E8E8E"
							fontSize="18px"
							sx={{
								fontWeight: "bold",
								marginBottom: 0.5,
								color: "#186F65",
							}}>
							Potental Root Problem
						</Typography>
						<Box>
							<Paper
								variant="outlined"
								sx={{
									padding: 2,
									marginBottom: 1,
									borderRadius: 4,
									minWidth: "600px",
								}}>
								<Typography variant="body1">
									{details.potential_root}
								</Typography>
							</Paper>
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12}>
					<Box
						sx={{
							marginTop: 10,
							marginBottom: 10,
							width: "70%",
							margin: "auto",
							minWidth: "700px",
							maxWidth: "900px",
						}}>
						<Typography
							variant="h5"
							color="#8E8E8E"
							fontSize="18px"
							sx={{
								fontWeight: "bold",
								marginBottom: 0.5,
								color: "#186F65",
							}}>
							HMW Statement
						</Typography>
						<Box>
							{Array.isArray(details.hmws) &&
								details.hmws.length > 0 &&
								details.hmws.map((statement, index) => (
									<Paper
										variant="outlined"
										key={index}
										sx={{
											padding: 2,
											marginBottom: 1,
											borderRadius: 4,
											minWidth: "600px",
										}}>
										<Typography variant="body1">
											{statement}
										</Typography>
									</Paper>
								))}
						</Box>
					</Box>
				</Grid>
				<Box
					sx={{
						marginTop: 10,
						marginBottom: 12,
						width: "70%",
						margin: "auto",
						minWidth: "700px",
						maxWidth: "900px",
					}}>
					<Typography
						variant="h5"
						color="#8E8E8E"
						fontSize="18px"
						sx={{
							fontWeight: "bold",
							marginBottom: 0.5,
							color: "#186F65",
						}}>
						Elevator Pitch
					</Typography>

					{pitch.map((value, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<Paper
								variant="outlined"
								key={index}
								sx={{
									padding: 2,
									marginBottom: 1,
									borderRadius: 4,
									minWidth: "600px",
								}}>
								<Grid container spacing={2} alignItems="center">
									<Grid item xs={2}>
										<Typography variant="body2">
											{value}
										</Typography>
									</Grid>
									<Grid item xs={10}>
										{details.elevator_pitch[index] && (
											<Typography>
												{details.elevator_pitch[index]}
											</Typography>
										)}
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					))}
				</Box>
			</Grid>
		</Box>
	);
};

export default Report;

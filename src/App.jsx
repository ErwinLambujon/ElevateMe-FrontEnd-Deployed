import {
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/HomePage";
import Saved from "./pages/Saved";
import RoomPage from "./pages/Roompage";
import UserAppbar from "./components/UserAppbar";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import CssBaseline from "@mui/material/CssBaseline";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Venn from "./pages/Venn";
import FiveWhys from "./pages/FiveWhys";
import HMW from "./pages/HMW";
import AppRoute from "./components/AppRoute";
import ChannelPage from "./pages/ChannelPage";
import LoadingScreen from "./components/LoadingScreen";
import Ranking from "./pages/Ranking";
import Report from "./pages/Report";
import ElevatorPitch from "./components/popupcards/elevatorPitchPopUp/ElevatorPitch";
import UploadPSPopup from "./components/popupcards/uploadPSPopup/uploadPSPopup";

// This is the theme for the web app
var theme = createTheme({
	typography: {
		fontFamily: '"Lexend Deca", "Lexend", sans-serif',
		button: {
			textTransform: "none",
		},
		h1: {
			fontSize: "3rem",
			fontWeight: "bold",
			color: "#186F65",
		},
		h2: {
			fontSize: "2.7rem",
			fontWeight: "bold",
			color: "#186F65",
		},
		h3: {
			fontSize: "2rem",
			fontWeight: "bold",
			color: "#186F65",
		},
		h4: {
			color: "#186F65",
			fontSize: "1.5rem",
			fontWeight: "bold",
		},
		h5: {
			color: "#6A6A6A",
			fontSize: "1.3rem",
			fontWeight: "bold",
		},
		body1: {
			fontSize: "1rem",
			color: "#071C29",
		},
		body2: {
			fontSize: "0.98rem",
			color: "#186F65",
			fontWeight: "bold",
		},
	},
	palette: {
		background: {
			default: "white",
		},
		primary: {
			main: "#186F65",
		},
		secondary: {
			main: "#C5DCC2",
		},
		stroke: {
			main: "#035082",
		},
		gray: {
			main: "#DADADA",
		},
	},
});

// const entry = createTheme({
//   typography: {
//     fontFamily: '"Lexend Deca", "Lexend", sans-serif',
//     button: {
//       textTransform: 'none',
//     },
//   },
//   palette: {
//     background: {
//       default: '#c5dcc2',
//     },
//     primary: {
//       main: '#186F65',
//     },
//     secondary: {
//       main: '#C5DCC2',
//     },
//     text: {
//       main: '#071C29',
//     },
//     stroke: {
//       main: '#035082',
//     },
//     gray: {
//       main: '#DADADA',
//     },
//   },
// });

// createContext(entry);

// https://stackoverflow.com/questions/61600091/react-router-and-material-ui-applying-custom-themes-depending-on-route

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppRoute />}>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="" element={<UserAppbar />}>
          <Route path="home" element={<Home />} />
          <Route path="saved" element={<Saved />} />
          <Route path="venn" element={<Venn />} />
          <Route path="rank" element={<Ranking />} />
          <Route path="five_whys" element={<FiveWhys />} />
          <Route path="hmw" element={<HMW />} />
          <Route path="elevator" element={<ElevatorPitch />} />
          <Route path="room" element={<RoomPage />} />
          <Route path="report" element={<Report />} />

          <Route
            path="/room/channel/"
            element={<ChannelPage />}
          />
        </Route>
        <Route path="report" element={<Report />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

export default App;

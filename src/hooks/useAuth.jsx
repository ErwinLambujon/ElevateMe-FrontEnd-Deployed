import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../helpers/constant";
import axiosInstance from "../helpers/axios";

const useAuth = () => {
	const navigate = useNavigate();

	const Login = async (user) => {
		if (!user.email || !user.password) {
			alert("Please enter both email and password");
			return;
		}
		try {
			/*console.log("Login attempt with payload:", {
        email: user.email,
        password: user.password,
      });*/

			let response = await axiosInstance.post(
				`/api/user/login/`,
				{
					email: user.email,
					password: user.password,
				}
			);

			if (response.status === 200) {
				localStorage.setItem("token", response.data.token);
				// alert("Login successfully!");
				navigate("/home", { replace: true });
			}
		} catch (err) {
			if (err.code === "ERR_BAD_REQUEST") {
				alert(err.response.data.error);
			} else {
				alert("Not connected with the back-end server");
			}
		}
	};

	const Logout = async () => {
		try {
			let token = localStorage.getItem("token");

			await axiosInstance.post(
				`/api/user/logout/`,
				{},
				{
					headers: { Authorization: `Token ${token}` },
				}
			);

			localStorage.removeItem("token");
			sessionStorage.clear();

			navigate("/login", { replace: true });
		} catch (err) {
			// console.log(err);
		}
	};

	const getCurrentlyLogin = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("No token found. Please log in.");
			}
			const response = await axiosInstance.get(
				`/api/user/get_currently_login/`,
				{
					headers: {
						Authorization: `Token ${token}`,
					},
				}
			);
			
			return response.data;
		} catch (error) {
			console.error("Error fetching user info:", error);
			return null;
		}
	};

	return { Login, Logout, getCurrentlyLogin };
};

export default useAuth;

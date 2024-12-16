import axios from "axios";
import { API_BASE_URL_DEV } from "./constant";

const axiosInstance = axios.create({
	baseURL: `${API_BASE_URL_DEV}`,
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);


axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			console.error("Unauthorized! Redirecting to login...");
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;

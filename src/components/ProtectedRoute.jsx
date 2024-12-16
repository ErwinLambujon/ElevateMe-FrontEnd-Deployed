import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (!token) {
			navigate("/login", { replace: true });
		}
	}, [navigate, token]);

	return <Outlet />;
};

export default ProtectedRoute;

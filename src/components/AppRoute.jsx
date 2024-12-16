import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const AppRoute = () => {
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	const location = useLocation();

	const handleRedirection = () => {
		const isAuthenticatedRoute =
			location.pathname === "/login" || location.pathname === "/register";

		if (token && isAuthenticatedRoute) {
			navigate("/home", { replace: true });
		}
	};

	useEffect(() => {
		handleRedirection();
	});

	return <Outlet />;
};

export default AppRoute;

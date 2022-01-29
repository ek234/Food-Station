import React from "react";
import  { useNavigate } from "react-router-dom";

import DCust from "./DashboardCust";
import DVend from "./DashboardVend";

const Dashboard = (props) => {

	const isCust = localStorage.getItem("isCust");

	const nav = useNavigate();
	if (isCust === null) {
		nav("/login");
	}

	if ( isCust === "true" ) {
		return <DCust/>
	} else {
		return <DVend/>
	}

};

export default Dashboard;

import React, { useState, useEffect } from "react";

const Home = (props) => {
	const [name, setName] = useState("");

	useEffect(() => {
		setName("Mihir Rawat");
	}, []);

	return <div style={{ textAlign: "center" }}>DASS A1 - {name}</div>;
};

export default Home;

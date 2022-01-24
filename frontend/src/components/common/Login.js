import React, { useState } from "react";
import axios from "axios";
import { Grid, TextField, Button, Alert } from "@mui/material";
import  { Navigate } from "react-router-dom";

const Register = (props) => {

	const [isCust, setIsCust] = useState(true);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loggedIn, setLoggedIn] = useState( localStorage.getItem("id") === null ? false : true );

	const resetInputs = () => {
		setIsCust(true);
		setEmail("");
		setPassword("");
	};

	const onSubmit = (newVal) => {
		newVal.preventDefault();

		axios
			.post("http://localhost:4000/api/user/login", {
				isCust: isCust.toString(),
				email: email.toString(),
				password: password.toString()
			})
			.then((response) => {
				resetInputs();
				localStorage.setItem("id", response.data.id);
				localStorage.setItem("isCust", response.data.isCust);
				setLoggedIn(true);
				//alert("Login successful");
			})
			.catch(function (error) {
				var data = error.response.data;
				var message = "";
				for (var it in data) {
					message += data[it] + "\n";
				}
				alert(message);
			});
	};

	return (

		<div>
		{ ! loggedIn ? (

			<div>
			<Alert icon={false} id="alertbox" severity="success">Login User</Alert>

			<Grid container align={"center"} spacing={2}>

			{ isCust ? (
				<Grid item xs={12}>
				<Button
				variant="outlined"
				onClick={() => setIsCust(false)}>
				Customer
				</Button>
				</Grid>
			) : (
				<Grid item xs={12}>
				<Button
				variant="outlined"
				onClick={() => setIsCust(true)}>
				Vendor
				</Button>
				</Grid>
			)}

			<Grid item xs={12}>
			<TextField sx={{ minWidth: 550 }}
			label="Email"
			variant="outlined"
			value={email}
			onChange={(newVal) => setEmail(newVal.target.value)}
			/>
			</Grid>

			<Grid item xs={12}>
			<TextField sx={{ minWidth: 550 }}
			label="Password"
			variant="outlined"
			value={password}
			onChange={(newVal) => setPassword(newVal.target.value)}
			/>
			</Grid>


			<Grid item xs={12}>
			<Button variant="contained" onClick={onSubmit}>
			Login
			</Button>
			</Grid>

			</Grid>
			</div>
		) : (
			<Navigate to='/dashboard'/>
		)}
		</div>
	);
};

export default Register;

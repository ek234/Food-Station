import React, { useState } from "react";
import axios from "axios";
import { Grid, TextField, Button, Alert } from "@mui/material";
import  { Navigate, useNavigate } from "react-router-dom";
import GoogleLogin from 'react-google-login';

const Register = (props) => {

	const [isCust, setIsCust] = useState(true);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loggedIn, setLoggedIn] = useState( localStorage.getItem("id") === null ? false : true );

	const nav = useNavigate();

	const resetInputs = () => {
		setIsCust(true);
		setEmail("");
		setPassword("");
	};

	const onGoogleLogin = (token) => {
		axios
			.post("http://localhost:4000/api/user/loginGoogle", {
				isCust: isCust.toString(),
				email: token.profileObj.email.toString(),
				google: true
			})
			.then((response) => {
				resetInputs();
				localStorage.setItem("id", response.data.id);
				localStorage.setItem("isCust", response.data.isCust);
				setLoggedIn(true);
			})
			.catch(function (error) {
				var data = error.response.data;
				var message = "";
				for (var it in data) {
					message += data[it] + "\n";
				}
				alert(message);
			})
	};

	const onGoogleLoginFail = () => {
		alert("failed login");
	}

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
			<GoogleLogin
			clientId="447326655638-i3hpv52lbdti6a76uv2bc2ls08mk4c4o.apps.googleusercontent.com"
			buttonText="Login"
			onSuccess={onGoogleLogin}
			onFailure={onGoogleLoginFail}
			cookiePolicy={'single_host_origin'}
			/>
			</Grid>

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

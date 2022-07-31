import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Grid, TextField, Button } from "@mui/material";

const Profile = () => {

	const nav = useNavigate();
	if (localStorage.getItem("isCust") !== "true") {
		alert("not a customer");
		nav("/login");
	}

	const [editDisabled, setEditDisabled] = useState(true);

	const email = localStorage.getItem("id");

	const [wallet, setWallet] = useState(0);
	const [toAdd, setToAdd] = useState("");

	useEffect(() => {

		axios
			.post("/api/user/profile", {
				email: email.toString(),
				isCust: "true"
			})
			.then((response) => {
				setWallet(typeof response.data.wallet !== 'undefined' ? response.data.wallet : 0);
			})
			.catch((error) => {
				console.log(error);
			});

	}, [email]);

	const onSubmit = (newVal) => {
		newVal.preventDefault();

		if (!editDisabled) {

			const numToAdd = Number(toAdd);

			if (typeof numToAdd === "number" && toAdd >= 0) {

				axios
					.post("/api/user/addMoney", { wallet: Number(numToAdd), email: email })
					.then((response) => {
						setWallet(response.data.wallet)
						setEditDisabled(!editDisabled);
						setToAdd("");
					})
					.catch(function (error) {
						var data = error.response.data;
						var message = "";
						for (var it in data) {
							message += data[it] + "\n";
						}
						alert(message);
					});
			} else {
				alert("Invalid Value");
			}
		} else {
			setEditDisabled(!editDisabled);
			setToAdd("");
		}
	};


	return (

		<div>

		<Grid container align={"center"} spacing={2}>

		<Grid item xs={12}>
		<TextField sx={{ minWidth: 550 }}
		label="Wallet"
		variant="outlined"
		value={wallet}
		disabled={true}
		/>
		</Grid>

		{editDisabled ? (
			<Grid item xs={12}>
			<Button variant="contained" onClick={onSubmit}>
			Add Money
			</Button>
			</Grid>
		) : (

			<Grid item xs={12}>
			<Grid item xs={12}>
			<TextField sx={{ minWidth: 550 }}
			label="Add Money"
			variant="outlined"
			value={toAdd}
			onChange={(newVal) => {setToAdd(newVal.target.value)}}
			/>
			</Grid>

			<Grid item xs={12}>
			<Button variant="contained" onClick={onSubmit}>
			Save
			</Button>
			</Grid>
			</Grid>
		)}

		</Grid>



		</div>


	)
};

export default Profile;

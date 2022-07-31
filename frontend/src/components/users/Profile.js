import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Grid, TextField, Button, MenuItem } from "@mui/material";
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Profile = () => {

	const nav = useNavigate();
	if (localStorage.getItem("id") === null) {
		nav("/login");
	}

	const [editDisabled, setEditDisabled] = useState(true);

	const isCust = localStorage.getItem("isCust") === "true";
	const email = localStorage.getItem("id");

	const [contact, setContact] = useState("");
	const [password, setPassword] = useState("");

	const [name, setName] = useState("");
	const [age, setAge] = useState("");
	const [batch, setBatch] = useState("");

	const [manager, setManager] = useState("");
	const [shop, setShop] = useState("");
	const [openingTime, setOpeningTime] = useState(new Date());
	const [closingTime, setClosingTime] = useState(new Date());

	const batches = [ 'UG1',  'UG2',  'UG3',  'UG4',  'UG5' ];

	useEffect(() => {

		axios
			.post("/api/user/profile", {
				email: email.toString(),
				isCust: isCust.toString()
			})
			.then((response) => {
				console.log(response);
				setContact(typeof response.data.contact !== 'undefined' ? response.data.contact : "");
				setPassword(typeof response.data.password !== 'undefined' ? response.data.password : "");
				setName(typeof response.data.name !== 'undefined' ? response.data.name : "");
				setAge(typeof response.data.age !== 'undefined' ? response.data.age : "");
				setBatch(typeof response.data.batch !== 'undefined' ? response.data.batch : "");
				setManager(typeof response.data.manager !== 'undefined' ? response.data.manager : "");
				setShop(typeof response.data.shop !== 'undefined' ? response.data.shop : "");
				setOpeningTime(typeof response.data.openingTime !== 'undefined' ? new Date(0, 0, 0, Math.floor(response.data.openingTime/60), response.data.openingTime%60) : new Date());
				setClosingTime(typeof response.data.closingTime !== 'undefined' ? new Date(0, 0, 0, Math.floor(response.data.closingTime/60), response.data.closingTime%60) : new Date());
			})
			.catch((error) => {
				console.log(error);
			});

	}, [email, isCust]);

	const onSubmit = (newVal) => {
		newVal.preventDefault();

		if (!editDisabled) {
			let newUser;

			const ot = openingTime.getHours()*60 + openingTime.getMinutes();
			const ct = closingTime.getHours()*60 + closingTime.getMinutes();

			newUser = {
				isCust: isCust.toString(),
				email: email.toString(),
				contact: contact.toString(),
				password: password.toString(),
				name: name.toString(),
				age: age.toString(),
				batch: batch.toString(),
				manager: manager.toString(),
				shop: shop.toString(),
				openingTime: ot.toString(),
				closingTime: ct.toString(),
			};

			axios
				.post("/api/user/edit", newUser)
				.then((response) => {
					alert("Edited: " + response.data.email);
					setEditDisabled(!editDisabled);
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
			setEditDisabled(!editDisabled);
		}
	};


	return (

		<div>

			<Grid container align={"center"} spacing={2}>

			{ isCust ? (

				<Grid container align={"center"} spacing={2}>

				<Grid item xs={12}>
				<Button
				variant="outlined"
				>
				Customer
				</Button>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Name"
				variant="outlined"
				value={name}
				onChange={(newVal) => setName(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Email"
				variant="outlined"
				value={email}
				disabled={true}
				/>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Contact"
				variant="outlined"
				value={contact}
				onChange={(newVal) => setContact(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Age"
				variant="outlined"
				value={age}
				onChange={(newVal) => setAge(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				select
				label="Batch"
				variant="outlined"
				value={batch}
				onChange={(newVal) => setBatch(newVal.target.value)}
				disabled={editDisabled}
				>
				{batches.map((bt) => (
					<MenuItem key={bt} value={bt}>
					{bt}
					</MenuItem>
				))}
				</TextField>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Password"
				variant="outlined"
				value={password}
				onChange={(newVal) => setPassword(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				</Grid>

			) : (

				<Grid container align={"center"} spacing={2}>

				<Grid item xs={12}>
				<Button
				variant="outlined"
				>
				Vendor
				</Button>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Manager"
				variant="outlined"
				value={manager}
				onChange={(newVal) => setManager(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Shop"
				variant="outlined"
				value={shop}
				onChange={(newVal) => setShop(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Email"
				variant="outlined"
				value={email}
				disabled={true}
				/>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Contact"
				variant="outlined"
				value={contact}
				onChange={(newVal) => setContact(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				<Grid item xs={12}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
				<TimePicker
				label="Opening Time"
				value={openingTime}
				onChange={(newVal) => setOpeningTime(newVal)}
				disabled={editDisabled}
				renderInput={(params) => <TextField {...params} />}
				/>
				<TimePicker
				label="Closing Time"
				value={closingTime}
				onChange={(newVal) => setClosingTime(newVal)}
				disabled={editDisabled}
				renderInput={(params) => <TextField {...params} />}
				/>
				</LocalizationProvider>
				</Grid>

				<Grid item xs={12}>
				<TextField sx={{ minWidth: 550 }}
				label="Password"
				variant="outlined"
				value={password}
				onChange={(newVal) => setPassword(newVal.target.value)}
				disabled={editDisabled}
				/>
				</Grid>

				</Grid>
			)}

				{editDisabled ? (
					<Grid item xs={12}>
					<Button variant="contained" onClick={onSubmit}>
					Edit
					</Button>
					</Grid>
				) : (
					<Grid item xs={12}>
					<Button variant="contained" onClick={onSubmit}>
					Save
					</Button>
					</Grid>
				)}

				</Grid>


		</div>


	)
};

export default Profile;

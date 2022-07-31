import React, { useState } from "react";
import axios from "axios";
import { Grid, TextField, Button, MenuItem, Alert } from "@mui/material";
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Register = () => {

	const [isCust, setIsCust] = useState(true);

	const [email, setEmail] = useState("");
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

	const resetInputs = () => {
		setIsCust(true);
		setEmail("");
		setContact("");
		setPassword("");
		setName("");
		setAge("");
		setBatch("");
		setManager("");
		setShop("");
		setOpeningTime(new Date());
		setClosingTime(new Date());
	};

	const onSubmit = (newVal) => {
		newVal.preventDefault();

		let newUser;

		if (isCust) {
			newUser = {
				isCust: isCust.toString(),
				name: name.toString(),
				email: email.toString(),
				contact: contact.toString(),
				age: age.toString(),
				batch: batch.toString(),
				password: password.toString(),
			};
		} else {
			const ot = openingTime.getHours()*60 + openingTime.getMinutes();
			const ct = closingTime.getHours()*60 + closingTime.getMinutes();

			newUser = {
				isCust: isCust.toString(),
				manager: manager.toString(),
				shop: shop.toString(),
				email: email.toString(),
				contact: contact.toString(),
				openingTime: ot.toString(),
				closingTime: ct.toString(),
				password: password.toString(),
			};
		}

		axios
			.post("/api/user/register", newUser)
			.then((response) => {
				resetInputs();
				alert("Added: " + response.data.email);
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
		<Alert icon={false} id="alertbox" severity="success">Register User</Alert>

		{ isCust ? (

			<Grid container align={"center"} spacing={2}>

			<Grid item xs={12}>
			<Button
			variant="outlined"
			onClick={() => setIsCust(false)}
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
			label="Contact"
			variant="outlined"
			value={contact}
			onChange={(newVal) => setContact(newVal.target.value)}
			/>
			</Grid>

			<Grid item xs={12}>
			<TextField sx={{ minWidth: 550 }}
			label="Age"
			variant="outlined"
			value={age}
			onChange={(newVal) => setAge(newVal.target.value)}
			/>
			</Grid>

			<Grid item xs={12}>
			<TextField sx={{ minWidth: 550 }}
			select
			label="Batch"
			variant="outlined"
			value={batch}
			onChange={(newVal) => setBatch(newVal.target.value)}
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
			/>
			</Grid>

			<Grid item xs={12}>
			<Button variant="contained" onClick={onSubmit}>
			Register
			</Button>
			</Grid>

			</Grid>

		) : (

			<Grid container align={"center"} spacing={2}>

			<Grid item xs={12}>
			<Button
			variant="outlined"
			onClick={() => setIsCust(true)}
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
			/>
			</Grid>

			<Grid item xs={12}>
			<TextField sx={{ minWidth: 550 }}
			label="Shop"
			variant="outlined"
			value={shop}
			onChange={(newVal) => setShop(newVal.target.value)}
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
			label="Contact"
			variant="outlined"
			value={contact}
			onChange={(newVal) => setContact(newVal.target.value)}
			/>
			</Grid>

			<Grid item xs={12}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TimePicker
			label="Opening Time"
			value={openingTime}
			onChange={(newVal) => setOpeningTime(newVal)}
			renderInput={(params) => <TextField {...params} />}
			/>
			<TimePicker
			label="Closing Time"
			value={closingTime}
			onChange={(newVal) => setClosingTime(newVal)}
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
			/>
			</Grid>


			<Grid item xs={12}>
			<Button variant="contained" onClick={onSubmit}>
			Register
			</Button>
			</Grid>

			</Grid>
		)}
		</div>
	);
};

export default Register;

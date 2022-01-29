import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, TextField, Button, Alert, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Paper, TableCell, TableHead, TableRow, Table, TableBody, List, IconButton, InputAdornment } from "@mui/material";
import  { useNavigate } from "react-router-dom";

const Dashboard = (props) => {

	const nav = useNavigate();
	if ( localStorage.getItem("isCust") !== "false" ) {
		nav("/home");
	}

	const email = localStorage.getItem("id");

	const [vend, setVend] = useState([]);

	const states = [ 'placed', 'accepted', 'cooking', 'ready for pickup', 'completed', 'rejected' ];

	const [menu, setMenu] = useState([]);
	const [orders, setOrders] = useState([]);

	const [ordPla, setOrdPla] = useState(0);
	const [ordPend, setOrdPend] = useState(0);
	const [ordComp, setOrdComp] = useState(0);

	useEffect(() => {
		const states = [ 'placed', 'accepted', 'cooking', 'ready for pickup', 'completed', 'rejected' ];
		axios
			.post("http://localhost:4000/api/user/profile", {
				email: email.toString(),
				isCust: "false"
			})
			.then((response) => {
				setVend(response.data);
				axios
					.get("http://localhost:4000/api/food/fetch", { params: { shop: response.data.shop } })
					.then((res) => {
						setMenu(res.data);
					})
					.catch((error) => {
						console.log(error);
					});
				axios
					.get("http://localhost:4000/api/order/fetch", { params: { shop: response.data.shop } })
					.then((res) => {
						setOrders(res.data);
						setOrdPla(res.data.length);
						setOrdPend(res.data.filter((or) => or.state!==states[4] && or.state!==states[5]).length)
						setOrdComp(res.data.filter((or) => or.state===states[4]).length)
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	}, [email]);

	const getTopMenu = () => {
		var tmpmenu = menu;
		tmpmenu.forEach((food) => {
			food["freq"] = 0;
			orders.forEach((order) => {
				if (order.state === states[4] && order.item === food.name) {
					food["freq"]++;
				}
			})
		})
		return tmpmenu.sort((a,b) => {
			return b.freq - a.freq;
		}).slice(0,5);
	}

	return (

		<div>
		<Grid container spacing={12}>

		<Grid item xs={6}>
		<Paper>
		<Table size="small">
			<TableHead>
			<TableRow>
			<TableCell>Top completed sales</TableCell>
			<TableCell>Number of purchases</TableCell>
			</TableRow>
			</TableHead>
			<TableBody>{
				getTopMenu().map((it, ind) => (
					<TableRow key={ind}>
					<TableCell>{it.name}</TableCell>
					<TableCell>{it.freq}</TableCell>
					</TableRow>
				))
			}</TableBody>
			</Table>
			</Paper>
		</Grid>

		<Grid item xs={6}>
		<Grid item xs={12}>
			<TextField
			label="placed orders"
			variant="outlined"
			value={ordPla}
			/>
		</Grid>
		<Grid item xs={12}>
			<TextField
			label="pending orders"
			variant="outlined"
			value={ordPend}
			/>
		</Grid>
		<Grid item xs={12}>
			<TextField
			label="completed orders"
			variant="outlined"
			value={ordComp}
			/>
		</Grid>
		</Grid>


		<Grid item xs={12}>
		</Grid>

		</Grid>
		</div>

	);
};

export default Dashboard;

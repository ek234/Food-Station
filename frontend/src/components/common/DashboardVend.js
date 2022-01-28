import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, TextField, Button, Alert, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Paper, TableCell, TableHead, TableRow, Table, TableBody, List, IconButton, InputAdornment } from "@mui/material";

const Dashboard = (props) => {

	const email = localStorage.getItem("id");

	const [vend, setVend] = useState({});

	const states = [ 'placed', 'accepted', 'cooking', 'ready for pickup', 'completed', 'rejected' ];

	const [orders, setOrders] = useState([]);

	useEffect(() => {
		axios
			.post("http://localhost:4000/api/user/profile", {
				email: email.toString(),
				isCust: "false"
			})
			.then((response) => {
				setVend(response.data);
				axios.get("http://localhost:4000/api/order/fetch", { params: { shop: response.data.shop } })
					.then((res) => {
						setOrders(res.data);
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	}, [email]);

	const handleNext = (order) => {
		let newState = "";
		if ( order.state === states[0] ) {
			let counter = 0;
			orders.forEach(e => {
				if ( e.state === states[1] || e.state === states[2] ) {
					counter += 1;
				}
			});
			console.log(counter)
			if ( counter < 10 ) {
				newState = states[1];
			} else {
				alert("Error: Cant add more than 10 items to accepted/cooking");
			}
		} else if ( order.state === states[1] ) {
			newState = states[2];
		} else if ( order.state === states[2] ) {
			newState = states[3];
		} else {
			console.log("cant proceed from " + order.state);
		}

		if ( newState !== "" ) {
			axios.post("http://localhost:4000/api/order/nextState", { order: order, newState: newState })
				.then((res) => {
					axios.get("http://localhost:4000/api/order/fetch", { params: { shop: vend.shop } })
						.then((res) => {
							setOrders(res.data);
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}

	const handleReject = (order) => {
		if ( order.state === states[0] ) {
			axios.post("http://localhost:4000/api/order/nextState", { order: order, newState: states[5] })
				.then((res) => {
					axios.get("http://localhost:4000/api/order/fetch", { params: { shop: vend.shop } })
						.then((res) => {
							setOrders(res.data);
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}


	return (
		<div>

			<Grid item xs={12}>
			<Paper>
			<Table size="small">
			<TableHead>
			<TableRow>
				<TableCell>Sr No.</TableCell>
				<TableCell>Buyer</TableCell>
				<TableCell>Item</TableCell>
				<TableCell>AddOns</TableCell>
				<TableCell>Quantity</TableCell>
				<TableCell>Placed Time</TableCell>
				<TableCell>Price</TableCell>
				<TableCell>State</TableCell>
				<TableCell></TableCell>
				<TableCell></TableCell>
			</TableRow>
			</TableHead>
			<TableBody>
				{orders.map((order, ind) => (
					<TableRow key={ind}>
						<TableCell>{ind.toString()}</TableCell>
						<TableCell>{order.buyer.toString()}</TableCell>
						<TableCell>{order.item.toString()}</TableCell>
						<TableCell>{order.addons.toString()}</TableCell>
						<TableCell>{order.quantity.toString()}</TableCell>
						<TableCell>{order.placedTime.toString()}</TableCell>
						<TableCell>{order.price.toString()}</TableCell>
						<TableCell>{order.state.toString()}</TableCell>
						<TableCell>
						{ order.state.toString() !== states[3] && order.state.toString() !== states[4] && order.state.toString() !== states[5] ? (
							<Button
							variant="outlined"
							onClick={() => handleNext(order)}>
							next
							</Button>
						) : (
							<></>
						) }
						</TableCell>
						<TableCell>
						{ order.state.toString() === states[0] ? (
							<Button
							variant="outlined"
							onClick={() => handleReject(order)}>
							reject
							</Button>
						) : (
							<></>
						) }
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			</Table>
			</Paper>
			</Grid>

		</div>
	);
};

export default Dashboard;

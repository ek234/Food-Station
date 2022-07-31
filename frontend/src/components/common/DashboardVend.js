import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid,
    Button,
    Paper,
    TableCell,
    TableHead,
    TableRow,
    Table,
    TableBody,
} from "@mui/material";

const Dashboard = () => {

	const email = localStorage.getItem("id");

	const [vend, setVend] = useState({});

	const states = [ 'placed', 'accepted', 'cooking', 'ready for pickup', 'completed', 'rejected' ];

	const [orders, setOrders] = useState([]);

	useEffect(() => {
		axios
			.post("/api/user/profile", {
				email: email.toString(),
				isCust: "false"
			})
			.then((response) => {
				setVend(response.data);
				axios
					.get("/api/order/fetch", { params: { shop: response.data.shop } })
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

	const sendMail = (order, orderStatus) => {
		console.log("hi")
		axios
			.post("/api/order/sendMail", {
				buyer: order.buyer,
				orderStatus: "Vendor " + order.shop + " has " + orderStatus + " your order",
				orderDetails: order
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleNext = (order) => {
		let newState = "";
		if ( order.state === states[0] ) {
			let counter = 0;
			orders.forEach(e => {
				if ( e.state === states[1] || e.state === states[2] ) {
					counter += 1;
				}
			});
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
			axios.post("/api/order/nextState", { order: order, newState: newState })
				.then(() => {
					axios.get("/api/order/fetch", { params: { shop: vend.shop } })
						.then((res) => {
							setOrders(res.data);
							if (newState === states[1]) {
								console.log("did")
								sendMail( order, "accepted" );
							}
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
			axios
				.post("/api/order/nextState", { order: order, newState: states[5] })
				.then(() => {
					axios
						.post("/api/user/addMoney", {
							email: order.buyer.toString(),
							wallet: order.price
						})
						.then(() => {
							alert("returned money");
						})
						.catch((error) => {
							console.log(error);
						});
					axios
						.get("/api/order/fetch", { params: { shop: vend.shop } })
						.then((res) => {
							setOrders(res.data);
							sendMail( order, "rejected" );
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
						<TableCell>{Math.floor(order.placedTime/60)}:{order.placedTime%60}</TableCell>
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Grid,
    Button,
    Rating,
    Paper,
    TableCell,
    TableHead,
    TableRow,
    Table,
    TableBody,
} from "@mui/material";
import  { useNavigate } from "react-router-dom";

const Dashboard = () => {

	const nav = useNavigate();
	if (localStorage.getItem("isCust") !== "true") {
		nav("/login");
	}

	const email = localStorage.getItem("id").toString();

	const [orders, setOrders] = useState([]);

	const states = [ 'placed', 'accepted', 'cooking', 'ready for pickup', 'completed', 'rejected' ];

	const refresh = () => {
		axios
			.get("/api/order/fetch", { params: { buyer: email } })
			.then((res) => {
				setOrders(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		axios
			.get("/api/order/fetch", { params: { buyer: email } })
			.then((res) => {
				setOrders(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [email]);

	const handleNext = (order) => {
			axios
				.post("/api/order/nextState", { order: order, newState: states[4] })
				.then((res) => {
					console.log(res);
					refresh();
				})
				.catch((error) => {
					console.log(error);
				});
	}

	const handleRate = (order, rating) => {
		rating = Number(rating);
		if ( typeof rating === "number" && rating >= 0 && rating <= 5 ) {
		axios
			.post("/api/food/getItem", { shop: order.shop, name: order.item })
			.then((res) => {
				const food = res.data;
				axios
					.post("/api/food/setRating", { item: food, newRating: rating })
					.then((res) => {
						console.log(res);
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
		} else {
			alert("invalid rating");
		}
	}


	return (

		<Grid item xs={12}>
		<Paper>
		<Table size="small">
		<TableHead>
		<TableRow>
		<TableCell>Sr No.</TableCell>
		<TableCell>Shop</TableCell>
		<TableCell>Item</TableCell>
		<TableCell>Quantity</TableCell>
		<TableCell>Placed Time</TableCell>
		<TableCell>Price</TableCell>
		<TableCell>State</TableCell>
		<TableCell>Rating</TableCell>
		<TableCell></TableCell>
		</TableRow>
		</TableHead>
		<TableBody>
		{orders.map((order, ind) => (
			<TableRow key={ind}>
			<TableCell>{ind.toString()}</TableCell>
			<TableCell>{order.shop.toString()}</TableCell>
			<TableCell>{order.item.toString()}</TableCell>
			<TableCell>{order.quantity.toString()}</TableCell>
			<TableCell>{Math.floor(order.placedTime/60)}:{order.placedTime%60}</TableCell>
			<TableCell>{order.price.toString()}</TableCell>
			<TableCell>{order.state.toString()}</TableCell>
			<TableCell/>
			<TableCell>
			{ order.state.toString() === states[3] ? (
				<Button
				variant="outlined"
				onClick={() => handleNext(order)}>
				Picked up
				</Button>
			) : (
				<></>
			) }
			{ order.state.toString() === states[4] ? (
				<Rating
				defaultValue={3}
				onChange={(event, newValue) => {
					handleRate(order, newValue);
				}}
				/>
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

	);
};

export default Dashboard;

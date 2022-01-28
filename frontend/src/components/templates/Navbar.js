import React from "react"
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Navbar = () => {
	const nav = useNavigate();

	return (
		<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static">
		<Toolbar>
		<Typography
		variant="h6"
		component="div"
		sx={{ cursor: "pointer" }}
		onClick={() => nav("/")}
		>
		Canteen Portal
		</Typography>
		<Box sx={{ flexGrow: 1 }} />
		<Button color="inherit" onClick={() => nav("/custs")}>
		Custs
		</Button>
		<Button color="inherit" onClick={() => nav("/vends")}>
		Vends
		</Button>
		{ localStorage.getItem("isCust") === null ? (
			<div>
			<Button color="inherit" onClick={() => nav("/register")}>
			Register
			</Button>
			<Button color="inherit" onClick={() => nav("/login")}>
			Login
			</Button>
			</div>
		) : (
			<div>
			<Button color="inherit" onClick={() => nav("/dashboard")}>
			Dashboard
			</Button>
			<Button color="inherit" onClick={() => nav("/profile")}>
			My Profile
			</Button>
			{ localStorage.getItem("isCust") === "true" ? (
				<>
				<Button color="inherit" onClick={() => nav("/addMoney")}>
				Add Money
				</Button>
				<Button color="inherit" onClick={() => nav("/myOrders")}>
				My Orders
				</Button>
				</>
			) : (
				<Button color="inherit" onClick={() => nav("/menu")}>
				Menu
				</Button>
			) }
			<Button
			color="inherit"
			variant="outlined"
			onClick={() => {
				localStorage.removeItem("id");
				localStorage.removeItem("isCust");
				nav("/login");
			}}>
			logout
			</Button>
			</div>
		)}
		</Toolbar>
		</AppBar>
		</Box>
	);
};

export default Navbar;

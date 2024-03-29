import React from "react"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import VendsList from "./components/users/VendsList";
import CustsList from "./components/users/CustsList";
import Home from "./components/common/Home";
import Register from "./components/common/Register";
import Login from "./components/common/Login";
import AddMoney from "./components/common/AddMoney";
import Menu from "./components/common/Menu";
import MyOrders from "./components/common/MyOrders";
import Dashboard from "./components/common/Dashboard";
import Navbar from "./components/templates/Navbar";
import Stats from "./components/common/Stats";
import Profile from "./components/users/Profile";

const Layout = () => {
	return (
		<div>
		<Navbar />
		<div className="container">
		<Outlet />
		</div>
		</div>
	);
};

function App() {
	return (
		<BrowserRouter>
		<Routes>
		<Route path="/" element={<Layout />}>
		<Route path="/" element={<Home />} />
		<Route path="custs" element={<CustsList />} />
		<Route path="vends" element={<VendsList />} />
		<Route path="register" element={<Register />} />
		<Route path="login" element={<Login />} />
		<Route path="addMoney" element={<AddMoney />} />
		<Route path="myOrders" element={<MyOrders />} />
		<Route path="dashboard" element={<Dashboard />} />
		<Route path="stats" element={<Stats />} />
		<Route path="menu" element={<Menu />} />
		<Route path="profile" element={<Profile />} />
		</Route>
		</Routes>
		</BrowserRouter>
	);
}

export default App;

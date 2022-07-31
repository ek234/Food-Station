import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, TextField, Button, Rating, Dialog, DialogActions, DialogContent, Paper, TableCell, TableHead, TableRow, Table, TableBody } from "@mui/material";
import  { useNavigate } from "react-router-dom";

const Dashboard = (props) => {

	const nav = useNavigate();
	if ( localStorage.getItem("isCust") !== "false" ) {
		nav("/home");
	}

	const [menu, setMenu] = useState([]);

	const email = localStorage.getItem("id");

	const [open, setOpen] = useState(false);
	const [edit, setEdit] = useState("");

	const [vend, setVend] = useState([]);

	useEffect(() => {
		axios
			.post("/api/user/profile", {
				email: email.toString(),
				isCust: "false"
			})
			.then((response) => {
				setVend(response.data);
				axios
					.get("/api/food/fetch", { params: { shop: response.data.shop } })
					.then((res) => {
						setMenu(res.data);
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((error) => {
				console.log(error);
			});
	}, [email, setVend]);

	const shop = vend.shop;

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [isVeg, setIsVeg] = useState(true);
	const [addons, setAddons] = useState([]);
	const [addonName, setAddonName] = useState("");
	const [addonPrice, setAddonPrice] = useState("");
	const [tags, setTags] = useState([]);

	const resetInput = () => {
		setName("");
		setPrice("");
		setIsVeg(true);
		setAddons([]);
		setAddonName("");
		setAddonPrice("");
		setTags([]);
	}

	const refresh = () => {
		axios
			.get("/api/food/fetch", { params: { shop: shop } })
			.then((res) => {
				setMenu(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleExit = () => {
		resetInput();
		setEdit("");
		setOpen(false);
	}

	const handleAdd = () => {
		axios
			.post("/api/food/addItem", {
				name: name.toString(),
				shop: shop.toString(),
				price: price.toString(),
				rating: "0",
				isVeg: isVeg.toString(),
				addons: addons,
				tags: tags.toString()
			})
			.then((response) => {
				refresh();
				handleExit();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleAddAddon = () => {
		let newAddon = {
			addonName: addonName,
			addonPrice: addonPrice
		};
		setAddons(prev => [...prev, newAddon]);
		setAddonName("");
		setAddonPrice("");
	}

	const deleteItem = (itemName) => {
		axios
			.post("/api/food/deleteItem", {
				name: itemName.toString(),
				shop: shop.toString()
			})
			.then((response) => {
				refresh();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleEdit = (itemName) => {
		console.log(edit)
		axios
			.post("/api/food/editItem", {
				ogName: edit.toString(),
				name: name.toString(),
				shop: shop.toString(),
				rating: "0",
				price: price.toString(),
				isVeg: isVeg.toString(),
				addons: addons,
				tags: tags.toString()
			})
			.then((response) => {
				refresh();
				console.log("hh")
				console.log(response);
				handleExit();
			})
			//.catch((error) => {
				//console.log(error);
			//});
	}

	return (
		<div>
		<Grid container>
		<Grid item xs={12}>
		<Grid item xs={12}>
		<Button
		variant="outlined"
		onClick={() => setOpen(true)}>
		Add
		</Button>
		</Grid>

		<Dialog open={open} onClose={handleExit}>

		<DialogContent align="center">
		<div spacing={12}>
		<TextField autoFocus
		label="name"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div>
		<TextField
		type="number"
		min={0}
		label="price"
		value={price}
		onInput={(e) => {if (e.target.validity.valid) setPrice(e.target.value);}}
		/>
		</div>

		<div>
		<Grid container align={"center"}>
		{ isVeg ? (
			<Grid item xs={12}>
			<Button
			variant="outlined"
			onClick={() => setIsVeg(false)}>
			Veg
			</Button>
			</Grid>
		) : (
			<Grid item xs={12}>
			<Button
			variant="outlined"
			onClick={() => setIsVeg(true)}>
			Non Veg
			</Button>
			</Grid>
		)}
		</Grid>
		</div>

		<div>
		<Grid container align={"center"}>
		<Grid item xs={12}>
		<div>
		<TextField
		label="addon name"
		value={addonName}
		onChange={(e) => setAddonName(e.target.value)}
		/>
		</div>

		<div>
		<TextField
		type="number"
		min={0}
		label="addon price"
		value={addonPrice}
		onInput={(e) => {if (e.target.validity.valid) setAddonPrice(e.target.value);}}
		/>
		</div>
		<Button onClick={handleAddAddon}>Add Addon</Button>
		</Grid>
		</Grid>
		</div>

		<div>
		<TextField
		label="tags(comma separated)"
		value={tags}
		onChange={(e) => setTags(e.target.value)}
		/>
		</div>
		</DialogContent>

		<DialogActions>
		<Button onClick={handleExit}>Cancel</Button>
		{ edit === "" ? (
		<Button onClick={handleAdd}>Add Item</Button>
		) : (
		<Button onClick={handleEdit}>Edit Item</Button>
		)}
		</DialogActions>

		</Dialog>

		</Grid>

		<Grid item xs={12}>
		<Paper>
		<Table size="small">
		<TableHead>
		<TableRow>
			<TableCell>Sr No.</TableCell>
			<TableCell>Name</TableCell>
			<TableCell>Shop</TableCell>
			<TableCell>Price</TableCell>
			<TableCell>Rating</TableCell>
			<TableCell>IsVeg</TableCell>
			<TableCell>AddOns</TableCell>
			<TableCell>Tags</TableCell>
			<TableCell>Edit</TableCell>
			<TableCell>Delete</TableCell>
		</TableRow>
		</TableHead>
		<TableBody>
		{menu.map((item, ind) => (
			<TableRow key={ind}>
			<TableCell>{ind.toString()}</TableCell>
			<TableCell>{item.name.toString()}</TableCell>
			<TableCell>{item.shop.toString()}</TableCell>
			<TableCell>{item.price.toString()}</TableCell>
			<TableCell><Rating value={item.rating ? item.rating : 0} precision={0.5} readOnly/></TableCell>
			<TableCell>{item.isVeg.toString()}</TableCell>
			<TableCell>{item.addons.map(it => [it.addonName, ":", it.addonPrice, " "])}</TableCell>
			<TableCell>{item.tags.toString()}</TableCell>
			<TableCell>{
				<Button
				variant="outlined"
				onClick={() => {
					setName(item.name);
					setPrice(item.price);
					setIsVeg(item.isVeg);
					setAddons(item.addons);
					setTags(item.tags);
					setEdit(item.name.toString());
					setOpen(true);
				}
				}>
				edit
				</Button>
			}</TableCell>
			<TableCell>{
				<Button
				variant="outlined"
				onClick={() => deleteItem(item.name.toString())}>
				delete
				</Button>
			}</TableCell>
			</TableRow>
		))}
		</TableBody>
		</Table>
		</Paper>
		</Grid>

		</Grid>
		</div>

	);
};

export default Dashboard;

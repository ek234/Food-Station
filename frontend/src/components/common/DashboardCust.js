import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, TextField, Checkbox, FormControlLabel, Autocomplete, Button, Rating, Alert, Dialog, DialogTitle, DialogActions, DialogContent, Typography, Paper, TableCell, TableHead, TableRow, Table, TableBody, List, IconButton, InputAdornment, Box, Slider, ArrowDownwardIcon, ArrowUpwardIcon } from "@mui/material";
import Fuse from 'fuse.js'

const Dashboard = (props) => {

	const email = localStorage.getItem("id");

	const [wallet, setWallet] = useState(0);
	const [cust, setCust] = useState({});
	const [menu, setMenu] = useState([]);
	const [filtMenu, setFiltMenu] = useState({});
	const [favMenu, setFavMenu] = useState([]);

	const [searchFilt, setSearchFilt] = useState("");
	const [veggieFilt, setVeggieFilt] = useState("all");
	const [shopsFilt, setShopsFilt] = useState([]);
	const [tagFilt, setTagFilt] = useState("");
	const [pRangeFilt, setPRangeFilt] = useState([0,100]);
	const [POrderFilt, setPOrderFilt] = useState("dis");
	const [ROrderFilt, setROrderFilt] = useState("dis");

	const [open, setOpen] = useState(false);
	const [itemBuy, setItemBuy] = useState({});
	const [itemAddonList, setItemAddonList] = useState([]);
	const [itemTagsList, setItemTagsList] = useState([]);
	const [addonsBuy, setAddonsBuy] = useState([]);
	const [costBuy, setCostBuy] = useState(0);
	const [quantityBuy, setQuantityBuy] = useState(1);

	const [allVends, setAllVends] = useState([]);
	let rightnow= new Date();
	const rn = Number(rightnow.getHours()*60 + rightnow.getMinutes());

	const states = [ 'placed', 'accepted', 'cooking', 'ready for pickup', 'completed', 'rejected' ];

	const isShopAvailable = (shop) => {
		const o = shop.openingTime;
		const c = shop.closingTime;
		return ( (o<rn && rn<c) || (c<o && o<rn) || (rn<c && c<o) );
	}

	useEffect(() => {

		const isShopAvailable = (shop) => {
			const o = shop.openingTime;
			const c = shop.closingTime;
			return ( (o<rn && rn<c) || (c<o && o<rn) || (rn<c && c<o) );
		}

		setFiltMenu(() => {
			console.log("start")
			var tmpM = menu;

			if ( searchFilt !== "" ) {
				console.log(searchFilt)
				const fuseOptions = {keys: ["name"]};
				const fuse = new Fuse(tmpM, fuseOptions);
				tmpM = fuse.search(searchFilt).map(i=>i.item);
			}
			console.log(tmpM);

			if (veggieFilt !== "all") {
				tmpM = tmpM.filter((it) => {
					return it.isVeg === (veggieFilt === "veg");
				})
			}

			if (shopsFilt.length > 0){
				tmpM = tmpM.filter((it) => {
					return shopsFilt.some((s) => s===it.shop);
				})
			}

			if (tagFilt.length > 0){
				tmpM = tmpM.filter((it) => {
					return tagFilt.every((t) => it.tags.includes(t));
				})
			}

			if ( pRangeFilt.length > 0 ){
				tmpM = tmpM.filter((it) => {
					return pRangeFilt[0]<=it.price && it.price<=pRangeFilt[1];
				})
			}

			if ( POrderFilt !== "dis" ) {
				tmpM.sort((a,b) => {
					return (POrderFilt === "asc") === (a.price > b.price);	// '===' is used as xnor
				})
			}

			if ( ROrderFilt !== "dis" ) {
				tmpM.sort((a,b) => {
					return (ROrderFilt === "asc") === (a.rating > b.rating);	// '===' is used as xnor
				})
			}

			tmpM.sort((a,b) => {
				var aa = isShopAvailable(allVends.find(v => v.shop === a.shop));
				var ba = isShopAvailable(allVends.find(v => v.shop === b.shop));
				var r = ( !aa ) && ( ba );
				return (r);
			})

			return tmpM;
		})

	}, [menu, searchFilt, veggieFilt, shopsFilt, tagFilt, pRangeFilt, POrderFilt, ROrderFilt, rn, allVends])

	useEffect(() => {
		axios
			.get("http://localhost:4000/api/user/fetchAllVend")
			.then((res) => {
				setAllVends(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	useEffect(() => {
		axios.get("http://localhost:4000/api/food/fetchAll", {})
			.then((res) => {
				setMenu(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	useEffect(() => {
		axios
			.post("http://localhost:4000/api/user/profile", {
				email: email.toString(),
				isCust: "true"
			})
			.then((response) => {
				setCust(response.data);
				setWallet(response.data.wallet);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [email]);

	const handleExit = () => {
		setOpen(false);
	}

	const handleSubmit = () => {
		if ( costBuy*quantityBuy <= wallet ) {
			axios
				.post("http://localhost:4000/api/order/addOrder", {
					buyer: cust.email.toString(),
					shop: itemBuy.shop.toString(),
					item: itemBuy.name.toString(),
					addons: addonsBuy.map(addon => addon.addonName),
					placedTime: rn,
					quantity: quantityBuy,
					price: costBuy*quantityBuy,
					state: states[0]
				})
				.then((response) => {
					axios
						.post("http://localhost:4000/api/user/addMoney", {
							email: cust.email,
							wallet: wallet-costBuy*quantityBuy
						})
						.then((response) => {
							setWallet(response.data.wallet);
							handleExit();
						})
						.catch((error) => {
							console.log(error);
						});
					alert("placed order");
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			alert("insuficient balance");
		}
	}

	const getTags = (inp) => {
		var r = [];
		inp.forEach( (m) => {
			r = r.concat(m.tags)
		})
		return r;
	}

	return (
		<div>

			<Grid container align={"center"} spacing={2}>

			<Grid item xs={12}>
			<TextField
			label="Wallet"
			variant="outlined"
			value={wallet}
			/>
			</Grid>

			<TextField
			value={"Favorites"}
			/>

		<Grid item xs={12}>
		<Paper>
		<Table size="small">
			<TableHead>
			<TableRow>
			<TableCell>Sr No.</TableCell>
			<TableCell>Name</TableCell>
			<TableCell>Shop</TableCell>
			<TableCell>
				Price
				<Button onClick={ () => {
					if (POrderFilt==="dis") {
						setPOrderFilt("asc")
						setROrderFilt("dis")
					} else if (POrderFilt==="asc") {
						setPOrderFilt("des")
						setROrderFilt("dis")
					} else {
						setPOrderFilt("dis")
					}
				}
				}>
					{POrderFilt}
				</Button>
			</TableCell>
			<TableCell>
				Rating
				<Button onClick={ () => {
					if (ROrderFilt==="dis") {
						setROrderFilt("asc")
						setPOrderFilt("dis")
					} else if (ROrderFilt==="asc") {
						setROrderFilt("des")
						setPOrderFilt("dis")
					} else {
						setROrderFilt("dis")
					}
				}
				}>
					{ROrderFilt}
				</Button>
			</TableCell>
			<TableCell>IsVeg</TableCell>
			<TableCell>AddOns</TableCell>
			<TableCell>Tags</TableCell>
			<TableCell>remove from Fav</TableCell>
			<TableCell>Buy</TableCell>
			</TableRow>
			</TableHead>
			<TableBody>
			{
				Array.isArray(favMenu) ?
					favMenu.map((it, ind) => (
						<TableRow key={ind}>
						<TableCell>{ind.toString()}</TableCell>
						<TableCell>{it.name.toString()}</TableCell>
						<TableCell>{it.shop.toString()}</TableCell>
						<TableCell>{it.price.toString()}</TableCell>
						<TableCell><Rating value={it.rating ? it.rating : 0} readOnly/></TableCell>
						<TableCell>{it.isVeg.toString()}</TableCell>
						<TableCell>{it.addons.map(it => [it.addonName, ":", it.addonPrice, "\n"])}</TableCell>
						<TableCell>{it.tags.toString()}</TableCell>
						<TableCell>{
							<Button
							variant="outlined"
							onClick={() => setFavMenu(prev => prev.filter(m => m.shop!==it.shop || m.name!==it.name))}>
							remove
							</Button>
						}</TableCell>
						<TableCell>{
							isShopAvailable( allVends.find(v => v.shop === it.shop) ) ? (
							<Button
							variant="outlined"
							onClick={() => {
								setItemBuy(it);
								setItemAddonList(it.addons);
								setItemTagsList(it.tags);
								setCostBuy(Number(it.price));
								setQuantityBuy(1);
								setOpen(true);
							}}>
							buy
							</Button>
							) : (
									<TextField
									value="closed shop"
									disabled={true}
									/>
							)
						}</TableCell>
						</TableRow>
					)) : null}
			</TableBody>
			</Table>
			</Paper>
			</Grid>

			<Grid item xs={3}>
			<TextField
			label="search"
			variant="outlined"
			value={searchFilt}
			onChange={(e)=>{setSearchFilt(e.target.value)}}
			/>
			</Grid>

			<Grid item xs={1}>
			<FormControlLabel
				label={veggieFilt}
				control={
					<Checkbox
						checked={veggieFilt==="veg"}
						indeterminate={veggieFilt==="nonveg"}
						onChange={()=>{
							if (veggieFilt==="veg")
								setVeggieFilt("all");
							else if (veggieFilt==="all")
								setVeggieFilt("nonveg")
							else
								setVeggieFilt("veg")
						}}
					/>
				}
			/>
			</Grid>

			<Grid item xs={3}>
			<Autocomplete
			multiple
			filterSelectedOptions
			disablePortal
			options={ allVends.map(v => v.shop) }
			sx={{ width: 300 }}
			renderInput={(params) => <TextField {...params} label="shop" />}
			onChange={(e,v)=>{setShopsFilt(v)}}
			/>
			</Grid>

			<Grid item xs={3}>
			<Autocomplete
			multiple
			filterSelectedOptions
			disablePortal
		options={ menu.length > 0 ? getTags(menu) : [] }
		sx={{ width: 300 }}
		renderInput={(params) => <TextField {...params} label="tags" />}
		onChange={(e,v)=>{
			setTagFilt(v)
			console.log(v)
		}}
		/>
		</Grid>

		<Grid item xs={2}>
		<Typography gutterBottom>
			price range: {pRangeFilt[0]}-{pRangeFilt[1]}
		</Typography>
		<Slider
			value={pRangeFilt}
			onChange={(e,v) => setPRangeFilt(v)}
			valueLabelDisplay="auto"
			label="h"
		/>
		</Grid>

		<Grid item xs={12}>
		<Paper>
		<Table size="small">
			<TableHead>
			<TableRow>
			<TableCell>Sr No.</TableCell>
			<TableCell>Name</TableCell>
			<TableCell>Shop</TableCell>
			<TableCell>
				Price
				<Button onClick={ () => {
					if (POrderFilt==="dis") {
						setPOrderFilt("asc")
						setROrderFilt("dis")
					} else if (POrderFilt==="asc") {
						setPOrderFilt("des")
						setROrderFilt("dis")
					} else {
						setPOrderFilt("dis")
					}
				}
				}>
					{POrderFilt}
				</Button>
			</TableCell>
			<TableCell>
				Rating
				<Button onClick={ () => {
					if (ROrderFilt==="dis") {
						setROrderFilt("asc")
						setPOrderFilt("dis")
					} else if (ROrderFilt==="asc") {
						setROrderFilt("des")
						setPOrderFilt("dis")
					} else {
						setROrderFilt("dis")
					}
				}
				}>
					{ROrderFilt}
				</Button>
			</TableCell>
			<TableCell>IsVeg</TableCell>
			<TableCell>AddOns</TableCell>
			<TableCell>Tags</TableCell>
			<TableCell>Add to Fav</TableCell>
			<TableCell>Buy</TableCell>
			</TableRow>
			</TableHead>
			<TableBody>
			{
				Array.isArray(filtMenu) ?
					filtMenu.map((it, ind) => (
						<TableRow key={ind}>
						<TableCell>{ind.toString()}</TableCell>
						<TableCell>{it.name.toString()}</TableCell>
						<TableCell>{it.shop.toString()}</TableCell>
						<TableCell>{it.price.toString()}</TableCell>
						<TableCell><Rating value={it.rating ? it.rating : 0} readOnly/></TableCell>
						<TableCell>{it.isVeg.toString()}</TableCell>
						<TableCell>{it.addons.map(it => [it.addonName, ":", it.addonPrice, "\n"])}</TableCell>
						<TableCell>{it.tags.toString()}</TableCell>
						<TableCell>{
							<Button
							variant="outlined"
							onClick={() => setFavMenu(prev => [...prev.filter(m => m.shop!==it.shop || m.name!==it.name), it])}>
							add
							</Button>
						}</TableCell>
						<TableCell>{
							isShopAvailable( allVends.find(v => v.shop === it.shop) ) ? (
							<Button
							variant="outlined"
							onClick={() => {
								setItemBuy(it);
								setItemAddonList(it.addons);
								setItemTagsList(it.tags);
								setCostBuy(Number(it.price));
								setQuantityBuy(1);
								setOpen(true);
							}}>
							buy
							</Button>
							) : (
									<TextField
									value="closed shop"
									disabled={true}
									/>
							)
						}</TableCell>
						</TableRow>
					)) : null}
			</TableBody>
			</Table>
			</Paper>
			</Grid>

			</Grid>


									<Dialog open={open} onClose={handleExit}>

									<DialogContent align="center">
									<Grid container align={"center"} spacing={3}>

									<Grid item xs={12}>
									<TextField
									label="name"
									value={itemBuy.name}
									/>

									<TextField
									label="price"
									value={itemBuy.price}
									/>
									</Grid>

									<Grid item xs={12}>
									{ itemBuy.isVeg ? (
										<Grid item xs={12}>
										<Button
										variant="outlined"
										>
										Veg
										</Button>
										</Grid>
									) : (
										<Grid item xs={12}>
										<Button
										variant="outlined"
										>
										Non Veg
										</Button>
										</Grid>
									)}
									</Grid>

		<Grid item xs={12}>
			<Table size="small">
			<TableHead>
			<TableRow>
			<TableCell>Add ons</TableCell>
			<TableCell>Price</TableCell>
			<TableCell></TableCell>
			</TableRow>
			</TableHead>
			<TableBody>
		{itemAddonList.map((addon,ind) => (
						<TableRow key={ind}>
			<TableCell>{addon.addonName.toString()}</TableCell>
			<TableCell>{addon.addonPrice.toString()}</TableCell>
			<TableCell>{
				addonsBuy.some((a) => {
					return a.addonName===addon.addonName && a.addonPrice===addon.addonPrice;
				}) ? (
					<Grid item xs={12}>
					<Button
					variant="outlined"
					onClick={() => {
						setAddonsBuy(prev => prev.filter( ad => ad.addonName!==addon.addonName || ad.addonPrice!==addon.addonPrice));
						setCostBuy(costBuy-Number(addon.addonPrice));
					}}
					>
					remove
					</Button>
					</Grid>
				) : (
					<Grid item xs={12}>
					<Button
					variant="outlined"
					onClick={() => {
						setAddonsBuy(prev => [...prev, { addonName: addon.addonName, addonPrice: addon.addonPrice }]);
						setCostBuy(costBuy+Number(addon.addonPrice));
					}}
					>
					add
					</Button>
					</Grid>
				)
			}
			</TableCell>
			</TableRow>
		))}
		</TableBody>
			</Table>
			</Grid>


		<Grid item xs={12}>
			<Table size="small">
			<TableHead>
			<TableRow>
			<TableCell>Tags</TableCell>
			</TableRow>
			</TableHead>
			<TableBody>
		{itemTagsList.map((tag,ind) => (
			<TableRow key={ind}>
			<TableCell>{tag}</TableCell>
			</TableRow>
		))}
		</TableBody>
			</Table>
			</Grid>

		<Grid item xs={12}>

									<TextField
									label="quantity"
									value={quantityBuy}
									onChange={(e) => {
										if (!Number.isNaN(Number(e.target.value)) && Number(e.target.value) >= 1) {
											setQuantityBuy(Number(Number(e.target.value)));
										} else if (e.target.value === "") {
											setQuantityBuy("");
										}
									}}
									/>

			</Grid>

		</Grid>
									</DialogContent>

									<DialogActions>
									<Button onClick={handleExit}>Cancel</Button>
									<Button onClick={handleSubmit}>Order</Button>
									</DialogActions>

									</Dialog>

		</div>
	);
};

export default Dashboard;

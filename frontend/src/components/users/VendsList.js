import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const VendsList = (props) => {
	const [vends, setVends] = useState([]);
	const [sort, setSort] = useState(true);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		axios
			.get("http://localhost:4000/api/user/listVend", { params: { search: searchText } }).then((response) => {
				setVends(response.data.sort((a, b) => {
					if (a.manager !== undefined && b.manager !== undefined) {
						return (!sort) === (a.manager > b.manager);	// '===' is used as xnor
					} else {
						return (!sort) === (a.email > b.email);	// '===' is used as xnor
					}
				}));
			})
			.catch((error) => {
				console.log(error);
			});
	}, [searchText, sort]);

	const sortChange = () => {
		let vendsTemp = vends;
		vendsTemp.sort((a, b) => {
			if (a.manager !== undefined && b.manager !== undefined) {
				return (sort) === (a.manager > b.manager);	// '===' is used as xnor
			} else {
				return (sort) === (a.email > b.email);	// '===' is used as xnor
			}
		});
		setVends(vendsTemp);
		setSort(!sort);
	};

	const search = (event) => {
		console.log(event.target.value);
		setSearchText(event.target.value);

		axios
			.get("http://localhost:4000/api/user/listVend", { params: { search: searchText } }).then((response) => {
				setVends(response.data.sort((a, b) => {
					if (a.manager !== undefined && b.manager !== undefined) {
						return (!sort) === (a.manager > b.manager);	// '===' is used as xnor
					} else {
						return (!sort) === (a.email > b.email);	// '===' is used as xnor
					}
				}));
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			<Grid container>
				<Grid item xs={12}>
					<List component="nav" aria-label="mailbox folders">
						<TextField
						id="standard-basic"
						label="Search Shop"
						fullWidth={true}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
								<IconButton>
								<SearchIcon />
								</IconButton>
								</InputAdornment>
							),
						}}
						onChange = {search}
						/>
					</List>
				</Grid>
			</Grid>
		<Grid container>
			<Grid item xs={12}>
				<Paper>
					<Table size="small">
						<TableHead>
						<TableRow>
						<TableCell>Sr No.</TableCell>
						<TableCell>Shop</TableCell>
						<TableCell>
							Manager
							<Button onClick={sortChange}>
								{sort ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
							</Button>
						</TableCell>
						<TableCell>email</TableCell>
						<TableCell>contact</TableCell>
						<TableCell>openingTime</TableCell>
						<TableCell>closingTime</TableCell>
						<TableCell>password</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
						{vends.map((vend, ind) => (
							<TableRow key={ind}>
							<TableCell>{ind}</TableCell>
							<TableCell>{vend.shop}</TableCell>
							<TableCell>{vend.manager}</TableCell>
							<TableCell>{vend.email}</TableCell>
							<TableCell>{vend.contact}</TableCell>
							<TableCell>{vend.openingTime}</TableCell>
							<TableCell>{vend.closingTime}</TableCell>
							<TableCell>{vend.password}</TableCell>
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

export default VendsList;

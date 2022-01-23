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

const CustsList = (props) => {
	const [custs, setCusts] = useState([]);
	const [sortName, setSortName] = useState(true);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		axios
			.get("http://localhost:4000/api/user/listCust", { params: { search: searchText } }).then((response) => {
				setCusts(response.data.sort((a, b) => {
					if (a.name !== undefined && b.name !== undefined) {
						return (!sortName) === (a.name > b.name);	// '===' is used as xnor
					} else {
						return (!sortName) === (a.email > b.email);	// '===' is used as xnor
					}
				}));
			})
			.catch((error) => {
				console.log(error);
			});
	}, [searchText, sortName]);

	const sortChange = () => {
		let custsTemp = custs;
		custsTemp.sort((a, b) => {
			if (a.name !== undefined && b.name !== undefined) {
				return (sortName) === (a.name > b.name);	// '===' is used as xnor
			} else {
				return (sortName) === (a.email > b.email);	// '===' is used as xnor
			}
		});
		setCusts(custsTemp);
		setSortName(!sortName);
	};

	const searchName = (event) => {
		console.log(event.target.value);
		setSearchText(event.target.value);

		axios
			.get("http://localhost:4000/api/user/listCust", { params: { search: searchText } }).then((response) => {
				setCusts(response.data.sort((a, b) => {
					if (a.name !== undefined && b.name !== undefined) {
						return (!sortName) === (a.name > b.name);	// '===' is used as xnor
					} else {
						return (!sortName) === (a.email > b.email);	// '===' is used as xnor
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
						label="Search Name"
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
						onChange = {searchName}
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
						<TableCell>
							Name
							<Button onClick={sortChange}>
								{sortName ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
							</Button>
						</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>contact</TableCell>
						<TableCell>age</TableCell>
						<TableCell>batch</TableCell>
						<TableCell>wallet</TableCell>
						<TableCell>password</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
						{custs.map((cust, ind) => (
							<TableRow key={ind}>
							<TableCell>{ind}</TableCell>
							<TableCell>{cust.name}</TableCell>
							<TableCell>{cust.email}</TableCell>
							<TableCell>{cust.contact}</TableCell>
							<TableCell>{cust.age}</TableCell>
							<TableCell>{cust.batch}</TableCell>
							<TableCell>{cust.wallet}</TableCell>
							<TableCell>{cust.password}</TableCell>
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

export default CustsList;

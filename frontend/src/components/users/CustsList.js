import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Paper,
    Grid,
    TableCell,
    TableHead,
    TableRow,
    Table,
    TableBody,
    Button,
    TextField,
    List,
    IconButton,
    InputAdornment,
} from "@mui/material";

import {
    Search as SearchIcon,
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";

const CustsList = () => {
	const [custs, setCusts] = useState([]);
	const [sortName, setSortName] = useState(true);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		axios
			.get("/api/user/listCust", { params: { search: searchText } }).then((response) => {
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
			.get("/api/user/listCust", { params: { search: searchText } }).then((response) => {
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

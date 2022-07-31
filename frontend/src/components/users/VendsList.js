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

const VendsList = () => {
	const [vends, setVends] = useState([]);
	const [sort, setSort] = useState(true);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		axios
			.get("/api/user/listVend", { params: { search: searchText } }).then((response) => {
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
			.get("/api/user/listVend", { params: { search: searchText } }).then((response) => {
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

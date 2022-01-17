const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Key = require("../../../secret");

const validateRegisterInputC = require("../../validation/registerCust");
const validateLoginInputC = require("../../validation/loginCust");
const validateRegisterInputV = require("../../validation/registerVend");
const validateLoginInputV = require("../../validation/loginVend");

const Cust = require("../../models/customers");
const Vend = require("../../models/vendors");

router.post("/register", (req, res) => {

	if (req.body.isCust === '1') { // for customers
		var validation = validateRegisterInputC(req.body);
		if (validation.isValid) {
			Cust.findOne({ email: req.body.email }).then(cust => { if (!cust) {
				const newCust = new Cust({
					name: req.body.name,
					email: req.body.email,
					contact: req.body.contact,
					age: req.body.age,
					batch: req.body.batch,
					wallet: 0,
					password: req.body.password
				});
				newCust.save().then(cust => res.json(cust)).catch(err => console.log(err));
			} else {
				return res.status(400).json({ email: "email already registered" });
			}});
		} else {
			return res.status(400).json(validation.errors);
		}

	} else { // for vendors
		let validation = validateRegisterInputV(req.body);
		if (validation.isValid) {
			Vend.findOne({ shop: req.body.shop }).then(vend1 => { if (!vend1) {
				Vend.findOne({ email: req.body.email }).then(vend2 => { if (!vend2) {
					const newVend = new Vend({
						manager: req.body.manager,
						shop: req.body.shop,
						email: req.body.email,
						contact: req.body.contact,
						openingTime: req.body.openingTime,
						closingTime: req.body.closingTime,
						password: req.body.password
					});
					newVend.save().then(vend3 => res.json(vend3)).catch(err => console.log(err));
				} else {
					return res.status(400).json({ email: "email already registered" });
				}});
			} else {
				return res.status(400).json({ shop: "shop already registered" });
			}});
		} else {
			return res.status(400).json(validation.errors);
		}
	}

});

router.post("/login", (req, res) => {

	if (req.body.isCust === '1') { // for customers
		var validation = validateLoginInputC(req.body);
		if (validation.isValid) {
			Cust.findOne({ email: req.body.email }).then(cust => { if (cust) {
				if (cust.password === req.body.password) {
					const payload = {
						id: cust.email
					};
					jwt.sign(
						payload,
						Key,
						{ expiresIn: 86400 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token
							});
						}
					);
				} else {
					return res.status(400).json({ passwordwrong: "wrong password" });
				}
			} else {
				return res.status(400).json({ email: "email not registered" });
			}});
		} else {
			return res.status(400).json(validation.errors);
		}

	} else { // for vendors
		let validation = validateLoginInputV(req.body);
		if (validation.isValid) {
			Vend.findOne({ email: req.body.email }).then(vend => { if (vend) {
				if (vend.password === req.body.password) {
					const payload = {
						id: vend.email
					};
					jwt.sign(
						payload,
						Key,
						{
							expiresIn: 86400
						},
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token
							});
						}
					);
				} else {
					return res.status(400).json({ password: "wrong password" });
				}
			} else {
				return res.status(400).json({ email: "email not registered" });
			}});
		} else {
			return res.status(400).json(validation.errors);
		}
	}

});

module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Key = require("../../../secret");

const validateRegisterInput = require("../../validation/registerCust");
const validateLoginInput = require("../../validation/loginCust");

const Cust = require("../../models/customers");

router.post("/register", (req, res) => {
	var validation = validateRegisterInput(req.body);
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
});

router.post("/login", (req, res) => {
	var validation = validateLoginInput(req.body);
	if (validation.isValid) {
		Cust.findOne({ email: req.body.email }).then(cust => { if (cust) {
			if (cust.password === req.body.password) {
				const payload = {
					id: cust.email
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
				return res.status(400).json({ passwordwrong: "wrong password" });
			}
		} else {
			return res.status(400).json({ email: "email not registered" });
		}});
	} else {
		return res.status(400).json(validation.errors);
	}
});

module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Key = require("../../../secret");

const validateRegisterInput = require("../../validation/registerVend");
const validateLoginInput = require("../../validation/loginVend");

const Vend = require("../../models/vendors");

router.post("/register", (req, res) => {

	let validation = validateRegisterInput(req.body);
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
});

router.post("/login", (req, res) => {

	let validation = validateLoginInput(req.body);
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
});

module.exports = router;

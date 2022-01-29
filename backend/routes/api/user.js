const express = require("express");
const router = express.Router();

const Key = require("../../../secret");

const validateRegisterInputC = require("../../validation/registerCust");
const validateLoginInputC = require("../../validation/loginCust");
const validateRegisterInputV = require("../../validation/registerVend");
const validateLoginInputV = require("../../validation/loginVend");

const Cust = require("../../models/customers");
const Vend = require("../../models/vendors");

router.get("/fetchAllVend", (req, res) => {
	Vend.find()
		.then(vend => {
			return res.status(200).json(vend);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/listCust", (req, res) => {
	Cust.find({ name: { "$regex": req.query.search, "$options": "i" } }).then(cust => {
		return res.status(200).json(cust);
	})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/listVend", (req, res) => {
	Vend.find({ shop: { "$regex": req.query.search, "$options": "i" } }).then(vend => {
		return res.status(200).json(vend);
	})
		.catch((error) => {
			console.log(error);
		});
});

router.post("/profile", (req, res) => {
	if (req.body.isCust == "true") { // for customers
		Cust.findOne({ email: req.body.email }).then(cust => {
			return res.status(200).json(cust);
		})
			.catch((error) => {
				console.log(error);
			});
	} else { // for vendors
		Vend.findOne({ email: req.body.email }).then(vend => {
			return res.status(200).json(vend);
		})
			.catch((error) => {
				console.log(error);
			});
	}
});

router.post("/register", (req, res) => {

	if (req.body.isCust == "true") { // for customers
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
			}})
				.catch((error) => {
					console.log(error);
				});
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
				}})
					.catch((error) => {
						console.log(error);
					});
			} else {
				return res.status(400).json({ shop: "shop already registered" });
			}})
				.catch((error) => {
					console.log(error);
				});
		} else {
			return res.status(400).json(validation.errors);
		}
	}

});

router.post("/loginGoogle", (req, res) => {

	if (req.body.isCust == "true") { // for customers

		var validation = validateLoginInputC(req.body);
		if (validation.isValid) {
			Cust.findOne({ email: req.body.email }).then(cust => { if (cust) {
				const payload = {
					id: cust.email,
					isCust: "true"
				};
				return res.status(200).json(payload);
			} else {
				return res.status(400).json({ email: "email not registered" });
			}})
				.catch((error) => {
					console.log(error);
				});
		} else {
			return res.status(400).json(validation.errors);
		}

	} else { // for vendors

		var validation = validateLoginInputV(req.body);
		if (validation.isValid) {
			Vend.findOne({ email: req.body.email }).then(vend => { if (vend) {
				const payload = {
					id: vend.email,
					isCust: "false"
				};
				return res.status(200).json(payload);
			} else {
				return res.status(400).json({ email: "email not registered" });
			}})
				.catch((error) => {
					console.log(error);
				});
		}

	}});

router.post("/login", (req, res) => {

	if (req.body.isCust == "true") { // for customers

		var validation = validateLoginInputC(req.body);
		if (validation.isValid) {
			Cust.findOne({ email: req.body.email }).then(cust => { if (cust) {
				if (cust.password === req.body.password) {
					const payload = {
						id: cust.email,
						isCust: "true"
					};
					return res.status(200).json(payload);
				} else {
					return res.status(400).json({ password: "incorrect password" });
				}
			} else {
				return res.status(400).json({ email: "email not registered" });
			}})
				.catch((error) => {
					console.log(error);
				});
		} else {
			return res.status(400).json(validation.errors);
		}

	} else { // for vendors

		var validation = validateLoginInputV(req.body);
		if (validation.isValid) {
			Vend.findOne({ email: req.body.email }).then(vend => { if (vend) {
				if (vend.password === req.body.password) {
					const payload = {
						id: vend.email,
						isCust: "false"
					};
					return res.status(200).json(payload);
				} else {
					return res.status(400).json({ password: "incorrect password" });
				}
			} else {
				return res.status(400).json({ email: "email not registered" });
			}})
				.catch((error) => {
					console.log(error);
				});
		}

	}});

router.post("/edit", (req, res) => {

	if (req.body.isCust == "true") { // for customers
		var validation = validateRegisterInputC(req.body);
		if (validation.isValid) {
			Cust.findOne({ email: req.body.email }).then(cust => {
				if (cust) {
					cust.name = req.body.name;
					cust.email = req.body.email;
					cust.contact = req.body.contact;
					cust.age = req.body.age;
					cust.batch = req.body.batch;
					cust.wallet = 0;
					cust.password = req.body.password;
					cust.save().then(cust2 => res.status(200).json(cust2)).catch(err => res.status(400).send(err));
				} else {
					return res.status(400).json({ email: "email not registered" });
				}})
				.catch((error) => {
					console.log(error);
				});
		} else {
			return res.status(400).json(validation.errors);
		}

	} else { // for vendors
		let validation = validateRegisterInputV(req.body);
		if (validation.isValid) {
			Vend.findOne({ email: req.body.email }).then(vend => {
				if (vend) {
					vend.manager = req.body.manager;
					vend.shop = req.body.shop;
					vend.email = req.body.email;
					vend.contact = req.body.contact;
					vend.openingTime = req.body.openingTime;
					vend.closingTime = req.body.closingTime;
					vend.password = req.body.password;
					vend.save().then(vend2 => res.status(200).json(vend2)).catch(err => res.status(400).send(err));
				} else {
					return res.status(400).json({ user: "user not registered" });
				}})
				.catch((error) => {
					console.log(error);
				});
		} else {
			return res.status(400).json(validation.errors);
		}
	}

});

router.post("/addMoney", (req, res) => {
	Cust.findOne({ email: req.body.email }).then(cust => {
		if (cust) {
			cust.wallet += req.body.wallet;
			cust.save().then(cust2 => res.status(200).json(cust2)).catch(err => res.status(400).send(err));
		} else {
			return res.status(400).json({ email: "email not registered" });
		}})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;

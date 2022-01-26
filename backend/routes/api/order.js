const express = require("express");
const router = express.Router();

const Order = require("../../models/orders");

router.get("/fetch", (req, res) => {
	Order.find({ shop: req.query.shop })
		.then(order => {
			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post("/addOrder", (req, res) => {
	console.log("didi")
	const newOrder = new Order({
		buyer: req.body.buyer,
		shop: req.body.shop,
		item: req.body.item,
		addons: req.body.addons,
		placedTime: req.body.placedTime,
		quantity: req.body.quantity,
		price: req.body.price,
		state: req.body.state
	});
	newOrder.save().then((order) => res.json(order)).catch((err) => console.log(err));
});

router.post("/deleteItem", (req, res) => {
	Order.deleteOne({ buyer: req.body.buyer, shop: req.body.shop, item: req.body.item, addons: req.body.addons, quantity: req.body.quantity, price: req.body.price })
		.then(order => {
			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post("/nextState", (req, res) => {
	Order.findOne( req.body.order )
		.then(order => {
			if (order) {
				order.state = req.body.newState;
				order.save().then((order) => res.json(order)).catch((err) => console.log(err));
			} else {
				return res.status(406).json({ order: "order not found" });
			}
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;

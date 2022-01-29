const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Order = require("../../models/orders");

router.get("/fetch", (req, res) => {
	const shop = req.query.shop;
	const buyer = req.query.buyer;

	if (shop) {
		Order.find({ shop: shop })
		.then(order => {
			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
		});
	} else if (buyer) {
		Order.find({ buyer: buyer })
		.then(order => {
			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
		});
	} else {
		console.log("invalid request");
	}
});

router.post("/addOrder", (req, res) => {
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

router.post("/sendMail", (req, res) => {
	console.log("sendingaoeau")

	async function main() {
		let testAccount = await nodemailer.createTestAccount();
		let transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: testAccount.user, // generated ethereal user
				pass: testAccount.pass, // generated ethereal password
			},
		});

		let info = await transporter.sendMail({
			from: 'vendor', // sender address
			to: req.body.buyer, // list of receivers
			subject: "Foodserverer", // Subject line
			text: req.body.orderStatus, // plain text body
			html: "<b>Hello world?</b>", // html body
		});

		return info.messageId;

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	}

	return res.status(200).json(main().catch(console.error));
});

module.exports = router;

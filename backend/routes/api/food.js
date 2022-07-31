const express = require("express");
const router = express.Router();

const Food = require("../../models/food");

router.get("/fetchAll", (req, res) => {
	Food.find()
		.then(food => {
			return res.status(200).json(food);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/fetch", (req, res) => {
	Food.find({ shop: req.query.shop })
		.then(food => {
			return res.status(200).json(food);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post("/getItem", (req, res) => {
	Food.findOne({ shop: req.body.shop, name: req.body.name })
		.then(food => {
			return res.status(200).json(food);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post("/addItem", (req, res) => {
	const newFood = new Food({
		name: req.body.name,
		shop: req.body.shop,
		price: req.body.price,
		rating: req.body.rating,
		isVeg: req.body.isVeg,
		tags: req.body.tags.split(","),
		addons: req.body.addons
	});
	newFood.save().then((food) => res.json(food)).catch((err) => console.log(err));
});

router.post("/deleteItem", (req, res) => {
	Food.deleteOne({ shop: req.body.shop, name: req.body.name })
		.then(food => {
			return res.status(200).json(food);
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post("/editItem", (req, res) => {
	Food.findOne({ shop: req.body.shop, name: req.body.ogName })
		.then(food => {
			if (food) {
				food.name = req.body.name;
				food.shop = req.body.shop;
				food.price = req.body.price;
				food.isVeg = req.body.isVeg;
				food.tags = req.body.tags.split(",");
				food.addons = req.body.addons;
				food.save().then((food) => res.json(food)).catch((err) => console.log(err));
			} else {
				console.log("this item could not be found");
			}
		})
});

router.post("/setRating", (req, res) => {
	Food.findOne(req.body.item)
		.then(food => {
			if (food) {
				food.rating = Number(( Number(food.rating) * Number(food.numRating) + Number(req.body.newRating) ) / (Number(food.numRating) + 1))
				food.numRating = Number(food.numRating) + 1;
				food.save().then((food) => res.json(food)).catch((err) => console.log(err));
			} else {
				console.log("this item could not be found");
			}
		})
});

module.exports = router;

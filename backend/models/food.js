const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FoodSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	shop: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	isVeg: {
		type: Boolean,
		required: true
	},
	tags: {
		type: String,
		required: false
	}
});

module.exports = Food = mongoose.model("Foods", FoodSchema);
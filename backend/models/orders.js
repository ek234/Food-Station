const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
	item: {
		type: String,
		required: true
	},
	addons: {
		type: String,
		required: false
	},
	price: {
		type: Number,
		required: true
	}
});

module.exports = Order = mongoose.model("Orders", OrderSchema);

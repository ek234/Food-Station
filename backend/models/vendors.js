const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VendSchema = new Schema({
	manager: {
		type: String,
		required: true
	},
	shop: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	contact: {
		type: Number,
		required: true
	},
	openingTime: {
		type: Number,
		required: true,
	},
	closingTime: {
		type: Number,
		required: true,
	},
	password: {
		type: String,
		required: true,
	}
});

module.exports = Vend = mongoose.model("Vends", VendSchema);

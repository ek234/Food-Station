const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AddonSchema = new Schema({
	addonName: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	}
});

module.exports = Addon = mongoose.model("Addons", AddonSchema);

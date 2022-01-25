const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
	shop: {
		type: String,
		required: true
	},
	item: {
		type: String,
		required: true
	},
	addons: [{
		type: String,
		required: false
	}],
	placedTime: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		require: true
	},
	price: {
		type: Number,
		required: true
	},
	state: {
		type: String,
		enum: [ 'placed', 'accepted', 'cooking', 'ready for pickup', 'completed', 'rejected' ],
		required: true
	}
});

module.exports = Order = mongoose.model("Orders", OrderSchema);

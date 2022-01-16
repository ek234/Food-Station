const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CustSchema = new Schema({
	name: {
		type: String,
		required: true
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
	age: {
		type: Number,
		required: true
	},
	batch: {
		type: String,
		enum: [ 'UG1', 'UG2', 'UG3', 'UG4', 'UG5' ],
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

module.exports = Cust = mongoose.model("Custs", CustSchema);

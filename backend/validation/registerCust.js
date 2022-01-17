const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function checkRegistrationCust( input ) {
	let errors = {};

	input.isCust = !isEmpty(input.isCust) ? input.isCust : "";
	input.name = !isEmpty(input.name) ? input.name : "";
	input.email = !isEmpty(input.email) ? input.email : "";
	input.contact = !isEmpty(input.contact) ? input.contact : "";
	input.age = !isEmpty(input.age) ? input.age : "";
	input.batch = !isEmpty(input.batch) ? input.batch : "";
	input.password = !isEmpty(input.password) ? input.password : "";

	if (!Validator.isBoolean(input.isCust)) {
		errors.isCust = "isCust must be a bool";
	}
	if (Validator.isEmpty(input.name)) {
		errors.name = "name field can not be empty";
	}
	if (Validator.isEmpty(input.email)) {
		errors.email = "email field can not be empty";
	} else if (!Validator.isEmail(input.email)) {
		errors.email = "email is invalid";
	}
	if (Validator.isEmpty(input.contact)) {
		errors.contact = "contact field can not be empty";
	} else if (!Validator.isMobilePhone(input.contact, 'en-IN')) {
		errors.contact = "contact number is invalid";
	}
	if (Validator.isEmpty(input.age)) {
		errors.age = "age field can not be empty";
	} else if (!Validator.isInt(input.age, { min: 0 })) {
		errors.age = "age is invalid";
	}
	if (Validator.isEmpty(input.batch)) {
		errors.batch = "batch field can not be empty";
	} else if (!Validator.isIn(input.batch, [ "UG1", "UG2", "UG3", "UG4", "UG5" ])) {
		errors.batch = "batch is invalid";
	}
	if (Validator.isEmpty(input.password)) {
		errors.password = "password field can not be empty";
	} else if (!Validator.isLength(input.password, { min: 5, max: 20 })) {
		errors.password = "password must be between 5 and 20 characters";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

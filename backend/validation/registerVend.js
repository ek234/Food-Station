const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function checkRegistrationVend( input ) {
	let errors = {};

	input.isCust = !isEmpty(input.isCust) ? input.isCust : "";
	input.manager = !isEmpty(input.manager) ? input.manager : "";
	input.shop = !isEmpty(input.shop) ? input.shop : "";
	input.email = !isEmpty(input.email) ? input.email : "";
	input.contact = !isEmpty(input.contact) ? input.contact : "";
	input.openingTime = !isEmpty(input.openingTime) ? input.openingTime : "";
	input.closingTime = !isEmpty(input.closingTime) ? input.closingTime : "";
	input.password = !isEmpty(input.password) ? input.password : "";

	if (!Validator.isBoolean(input.isCust)) {
		errors.isVend = "isVend must be a bool";
	}
	if (Validator.isEmpty(input.manager)) {
		errors.manager = "manager field can not be empty";
	}
	if (Validator.isEmpty(input.shop)) {
		errors.shop = "shop name field can not be empty";
	}
	if (Validator.isEmpty(input.email)) {
		errors.email = "email field can not be empty";
	} else if (!Validator.isEmail(input.email)) {
		errors.email = "email is invalid";
	}
	if (Validator.isEmpty(input.contact)) {
		errors.contact = "contact field can not be empty";
	} else if (!Validator.isMobilePhone(input.contact, 'en-IN')) {
	console.log(input.contact);
	console.log( typeof input.contact )
		errors.contact = "contact number is invalid";
	}
	if (Validator.isEmpty(input.openingTime)) {
		errors.openingTime = "opening time field can not be empty";
	} else if (!Validator.isInt(input.openingTime, { min: 0, max: 1439 })) {
		errors.openingTime = "opening time is invalid";
	}
	if (Validator.isEmpty(input.closingTime)) {
		errors.closingTime = "closing time field can not be empty";
	} else if (!Validator.isInt(input.closingTime, { min: 0, max: 1439 })) {
		errors.closingTime = "closing time is invalid";
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

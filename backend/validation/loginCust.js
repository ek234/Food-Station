const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function checkLoginCust( input ) {
	let errors = {};

	input.email = !isEmpty(input.email) ? input.email : "";
	input.password = !isEmpty(input.password) ? input.password : "";

	if (Validator.isEmpty(input.email)) {
		errors.email = "email field can not be empty";
	} else if (!Validator.isEmail(input.email)) {
		errors.email = "email is invalid";
	}
	if (input.google!==true && Validator.isEmpty(input.password)) {
		errors.password = "password field can not be empty";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};

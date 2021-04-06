const validator = require('validator');
const variable = require('./variableManager');

module.exports = {
    isUsernameValid: (str) => {
        return validator.isAscii(str) && validator.matches(str,  /^[a-zA-Z_][0-9a-zA-Z_]*$/ );
    },
    isPasswordValid: (str) => {
        return validator.isStrongPassword(str);
    },
    isEmailValid: (str) => {
        return validator.isEmail(str);
    },
    isNotEmpty: (str) => {
        return str.length > 0;
    }
}
const {check} = require("express-validator");

class AuthValidator {
    getUsernameRegistrationValidator() {
        return check('username', 'Username must be between 4 and 15 characters long string!').isString().isLength({min: 4, max: 15});
    }

    getPasswordRegistrationValidator() {
        return check('password', 'Password length must be at least 4 characters!').isString().isLength({min: 4});
    }

    getEmailRegistrationValidator() {
        return check('email', 'Incorrect email address!').isEmail();
    }

    getUsernameLoginValidator() {
        return check('username', 'Username is required').notEmpty();
    }

    getPasswordLoginValidator() {
        return check('password', 'Password is required').notEmpty();
    }

}



module.exports = new AuthValidator();
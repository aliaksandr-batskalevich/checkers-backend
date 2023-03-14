import {check} from "express-validator";

class AuthValidator {
    getUsernameRegistrationValidator() {
        return check('username', 'Username must be between 4 and 15 characters long!').isLength({min: 4, max: 15});
    }

    getPasswordRegistrationValidator() {
        return check('password', 'Password must be between 4 and 10 characters long!').isLength({min: 4, max: 10})
    }

    getUsernameLoginValidator() {
        return check('username', 'Username is required').notEmpty();
    }

    getPasswordLoginValidator() {
        return check('password', 'Password is required').notEmpty();
    }

}



export default new AuthValidator();
import {Router} from "express";
import authController from '../controllers/auth.controller.js';
import authValidator from '../validators/auth.validator.js';
import authValidateMiddleware from "../middlewares/authValidate.middleware.js";

const router = new Router();

const registrationValidators = [
    authValidator.getUsernameRegistrationValidator(),
    authValidator.getPasswordRegistrationValidator(),
    authValidator.getEmailRegistrationValidator()
];
const loginValidators = [
    authValidator.getUsernameLoginValidator(),
    authValidator.getPasswordLoginValidator()
];

router.post('/registration',
    registrationValidators,
    authValidateMiddleware,
    authController.registration);

router.post('/login',
    loginValidators,
    authValidateMiddleware,
    authController.login);

router.delete('/logout', authController.logout)

export default router;
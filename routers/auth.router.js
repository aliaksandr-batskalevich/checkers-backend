import {Router} from "express";
import authController from '../controllers/auth.controller.js';
import authValidator from '../validators/auth.validator.js';
import validateMiddleware from "../middlewares/validate.middleware.js";
import isAuthMiddleware from "../middlewares/isAuth.middleware.js";

const router = new Router();

router.post('/registration',
    authValidator.getUsernameRegistrationValidator(),
    authValidator.getPasswordRegistrationValidator(),
    authValidator.getEmailRegistrationValidator(),
    validateMiddleware,
    authController.registration);

router.post('/login',
    authValidator.getUsernameLoginValidator(),
    authValidator.getPasswordLoginValidator(),
    validateMiddleware,
    authController.login);

router.get('/activate/:link',
    authController.activateAccount);

router.get('/refresh',
    authController.refreshToken);

router.delete('/logout',
    isAuthMiddleware,
    authController.logout)

export default router;
const Router = require("express").Router;
const authController = require('../controllers/auth.controller.js');
const authValidator = require('../validators/auth.validator.js');
const validateMiddleware = require("../middlewares/validate.middleware.js");
const isAuthMiddleware = require("../middlewares/isAuth.middleware.js");

const router = Router();

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

module.exports = router;
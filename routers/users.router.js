const Router = require("express").Router;
const userController = require('../controllers/users.controller.js');
const isAuthMiddleware = require("../middlewares/isAuth.middleware.js");
const paramsIdValidateMiddleware = require("../middlewares/paramsIdValidate.middleware.js");
const isMyAccountMiddleware = require("../middlewares/isMyAccount.middleware.js");

const router = Router();

router.get('/',
    isAuthMiddleware,
    userController.getAllUsers);

router.get('/:id',
    paramsIdValidateMiddleware,
    isAuthMiddleware,
    userController.getUser);

router.delete('/:id',
    paramsIdValidateMiddleware,
    isAuthMiddleware,
    isMyAccountMiddleware,
    userController.deleteUser);


module.exports = router;
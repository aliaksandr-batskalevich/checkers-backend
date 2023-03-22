const Router = require("express").Router;
const userController = require('../controllers/users.controller.js');
const isAuthMiddleware = require("../middlewares/isAuth.middleware.js");
const usersIdValidateMiddleware = require("../middlewares/usersIdValidate.middleware.js");
const isMyAccountMiddleware = require("../middlewares/isMyAccount.middleware.js");

const router = Router();

router.get('/',
    isAuthMiddleware,
    userController.getAllUsers);

router.get('/:id',
    usersIdValidateMiddleware,
    isAuthMiddleware,
    userController.getUser);

router.delete('/:id',
    usersIdValidateMiddleware,
    isAuthMiddleware,
    isMyAccountMiddleware,
    userController.deleteUser);


module.exports = router;
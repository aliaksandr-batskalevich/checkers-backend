import {Router} from "express";
import userController from '../controllers/users.controller.js';
import isAuthMiddleware from "../middlewares/isAuth.middleware.js";
import usersIdValidateMiddleware from "../middlewares/usersIdValidate.middleware.js";
import isMyAccountMiddleware from "../middlewares/isMyAccount.middleware.js";

const router = new Router();

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


export default router;
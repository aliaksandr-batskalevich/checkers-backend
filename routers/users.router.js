import {Router} from "express";
import userController from '../controllers/users.controller.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import usersIdValidateMiddleware from "../middlewares/usersIdValidate.middleware.js";
import isMyAccountMiddleware from "../middlewares/isMyAccount.middleware.js";

const router = new Router();

router.get('/',
    authMiddleware,
    userController.getAllUsers);

router.get('/:id',
    usersIdValidateMiddleware,
    authMiddleware,
    userController.getUser);

router.delete('/:id',
    usersIdValidateMiddleware,
    authMiddleware,
    isMyAccountMiddleware,
    userController.deleteUser);


export default router;
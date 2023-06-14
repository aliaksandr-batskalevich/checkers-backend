const Router = require("express").Router;
const userController = require('../controllers/users.controller.js');

const router = Router();

router.get('/',
    userController.getAllUsers);

router.get('/:id',
    userController.getUser);


module.exports = router;
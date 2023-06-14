const Router = require("express").Router;
const testUserController = require('../controllers/testUsers.controller.js');

const router = Router();

router.get('/',
    testUserController.getAllUsers);

router.get('/:id',
    testUserController.getUser);


module.exports = router;
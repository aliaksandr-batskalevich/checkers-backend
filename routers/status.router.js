const Router = require('express').Router;
const isAuthMiddleware = require("../middlewares/isAuth.middleware.js");
const statusController = require('../controllers/status.controller.js');

const router = Router();

router.post('/',
    isAuthMiddleware,
    statusController.createUserStatus);

module.exports = router;
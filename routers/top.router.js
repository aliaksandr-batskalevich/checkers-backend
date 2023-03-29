const Router = require('express').Router;
const isAuthMiddleware = require("../middlewares/isAuth.middleware.js");
const topController = require("../controllers/top.controller.js");

const router = Router();

router.get('/',
    isAuthMiddleware,
    topController.getTop10);

module.exports = router;
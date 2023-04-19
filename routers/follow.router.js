const Router = require('express').Router;
const isAuthMiddleware = require("../middlewares/isAuth.middleware.js");
const paramsIdValidateMiddleware = require('../middlewares/paramsIdValidate.middleware.js');
const followController = require('../controllers/follow.controller.js');

const router = Router();

router.post('/:id',
    isAuthMiddleware,
    paramsIdValidateMiddleware,
    followController.follow);

router.delete('/:id',
    isAuthMiddleware,
    paramsIdValidateMiddleware,
    followController.unFollow);

module.exports = router;
const Router = require("express").Router;
const isAuthMiddleware = require("../middlewares/isAuth.middleware.js");
const paramsIdValidateMiddleware = require("../middlewares/paramsIdValidate.middleware.js");
const gamesController = require('../controllers/games.controller.js');

const router = Router();

router.post('/',
    isAuthMiddleware,
    gamesController.createGame);

router.get('/',
    isAuthMiddleware,
    gamesController.getGames);

router.get('/:id',
    isAuthMiddleware,
    paramsIdValidateMiddleware,
    gamesController.getGame);

router.put('/:id',
    isAuthMiddleware,
    paramsIdValidateMiddleware,
    gamesController.updateGame);

module.exports = router;
const Router = require("express").Router;
const testController = require('../controllers/test.controller.js');

const router = Router();

router.get('/', testController.getTest);

module.exports = router;
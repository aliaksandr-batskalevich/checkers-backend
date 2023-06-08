const Router = require("express").Router;
const testController = require('../controllers/test.controller.js');

const router = Router();

router.get('/', testController.getTest);
router.post('/', testController.createTest);

module.exports = router;
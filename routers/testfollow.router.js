const Router = require('express').Router;
const testFollowController = require('../controllers/testFollow.controller.js');

const router = Router();

router.post('/:id',
    testFollowController.follow);

router.delete('/:id',
    testFollowController.unFollow);

module.exports = router;
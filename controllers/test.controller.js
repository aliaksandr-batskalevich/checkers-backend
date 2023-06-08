const testService = require('../services/test.service.js');

class TestController {
    async getTest(req, res, next) {
        try {
            const result = await testService.getTest();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async createTest(req, res, next) {
        try {
            const result = await testService.createTest();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TestController();
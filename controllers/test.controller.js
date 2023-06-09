const testService = require('../services/test.service.js');
const {ApiError} = require('../exceptions/ApiError.js');

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

    async errorTest(req, res, next) {
        try {
            // const result = await testService.errorTest();
            // res.json(result);
            ApiError.BadRequestError('Error from controller!');
        } catch (error) {
            console.log('catch');
            next(error);
        }
    }
}

module.exports = new TestController();

class TestService {
    async getTest() {
        console.log(`Test request!`);
        return {message: `Ok!`, data: {}};
    }
}

module.exports = new TestService();
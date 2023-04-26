const db = require('./db.js');

class DAL {

    // users
    async registrationUser(username, hashPassword, email, activationLink) {
        const result = await db.query(`INSERT INTO users (username, password, email, activation_link) VALUES ($1, $2, $3, $4) RETURNING *`, [username, hashPassword, email, activationLink]);
        return result.rows[0];
    }

    async getUserByName(username) {
        const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        return result.rows[0];
    }

    async getUserById(id) {
        const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async getUserByEmail(email) {
        const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        return result.rows[0];
    }

    async getUserByActivationLink(activationLink) {
        const result = await db.query(`SELECT * FROM users WHERE activation_link = $1`, [activationLink]);
        return result.rows[0];
    }

    async getAllUsers(count = 4, page = 1) {
        const totalCountResult = await db.query(`SELECT count(*) FROM users`);
        const totalCount = totalCountResult.rows[0].count;

        const offset = count * (page - 1);

        const result = await db.query(`SELECT * FROM users ORDER BY id DESC OFFSET $1 LIMIT $2`, [offset, count]);

        return {totalCount, users: result.rows};
    }

    async getUsersByIdArr(usersIdArr) {
        const result = await db.query(`SELECT * FROM users WHERE id = ANY($1::int[])`, [usersIdArr]);

        return result.rows;
    }

    async activateAccount(activationLink) {
        await db.query(`UPDATE users SET is_activated = true WHERE activation_link = $1`, [activationLink]);
    }

    async deleteUserById(id) {
        const result = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    }

    async refreshUsersToken(userId, refreshToken) {
        await db.query(`UPDATE users SET refresh_token = $2 WHERE id = $1`, [userId, refreshToken]);
    }

    async removeUsersToken(id) {
        await db.query(`UPDATE users SET refresh_token = null WHERE id = $1`, [id]);
    }

    // statuses
    async createUserStatus(userId, status, time) {
        const result = await db.query(`INSERT INTO statuses (user_id, status, time_status) VALUES ($1, $2, $3) RETURNING *`, [userId, status, time]);

        return result.rows[0];
    }

    async getLastUserStatus(userId) {
        const result = await db.query(`SELECT * FROM statuses WHERE user_id = $1 ORDER BY id DESC LIMIT 1`, [userId]);

        return result.rows[0];
    }

    async getLastUsersStatuses(usersIdArr) {
        const result = await db.query(`SELECT * FROM statuses WHERE user_id = ANY($1::int[]) ORDER BY id DESC`, [usersIdArr]);
        const allUsersStatuses = result.rows;

        // FILTER data with UNIQUE user_id
        const lastUsersStatuses = allUsersStatuses.filter((us, index, array) => array.findIndex(s => s.user_id === us.user_id) === index);

        return lastUsersStatuses;
    }

    // statistics
    async createUserStatistics(userId) {
        const result = await db.query(`INSERT INTO statistics (user_id) VALUES ($1) RETURNING *`, [userId]);

        return result.rows[0];
    }

    async removeUserStatistics(userId) {
        await db.query(`DELETE FROM statistics WHERE user_id = $1`, [userId]);
    }

    async getUserStatistics(userId) {
        const result = await db.query(`SELECT * FROM statistics WHERE user_id = $1`, [userId]);

        return result.rows[0];
    }

    async getUsersStatistics(usersIdArr) {
        const result = await db.query(`SELECT * FROM statistics WHERE user_id = ANY($1::int[])`, [usersIdArr]);

        return result.rows;
    }

    async getTopStatistics(count = 10) {
        const result = await db.query(`SELECT * FROM statistics ORDER BY rating DESC LIMIT $1`, [count]);

        return result.rows;
    }

    async incrementSubscribersCount(userId) {
        await db.query(`UPDATE statistics SET subscribers_count = subscribers_count + 1 WHERE user_id = $1`, [userId]);
    }

    async decrementSubscribersCount(userId) {
        await db.query(`UPDATE statistics SET subscribers_count = subscribers_count - 1 WHERE user_id = $1`, [userId]);
    }

    async incrementGamesJuniorCount(userId) {
        await db.query(`UPDATE statistics SET games_junior_count = games_junior_count + 1 WHERE user_id = $1`, [userId]);
    }

    async incrementGamesJuniorWinsCount(userId) {
        await db.query(`UPDATE statistics SET games_junior_wins_count = games_junior_wins_count + 1 WHERE user_id = $1`, [userId]);
    }

    async incrementGamesMiddleCount(userId) {
        await db.query(`UPDATE statistics SET games_middle_count = games_middle_count + 1 WHERE user_id = $1`, [userId]);
    }

    async incrementGamesMiddleWinsCount(userId) {
        await db.query(`UPDATE statistics SET games_middle_wins_count = games_middle_wins_count + 1 WHERE user_id = $1`, [userId]);
    }

    async incrementGamesSeniorCount(userId) {
        await db.query(`UPDATE statistics SET games_senior_count = games_senior_count + 1 WHERE user_id = $1`, [userId]);
    }

    async incrementGamesSeniorWinsCount(userId) {
        await db.query(`UPDATE statistics SET games_senior_wins_count = games_senior_wins_count + 1 WHERE user_id = $1`, [userId]);
    }

    async incrementSparringCount(userId) {
        await db.query(`UPDATE statistics SET sparring_count = sparring_count + 1 WHERE user_id = $1`, [userId]);
    }

    async incrementSparringWinsCount(userId) {
        await db.query(`UPDATE statistics SET sparring_wins_count = sparring_wins_count + 1 WHERE user_id = $1`, [userId]);
    }

    async updateUserRating(userId, rating) {
        const result = await db.query(`UPDATE statistics SET rating = $2 WHERE user_id = $1 RETURNING *`, [userId, rating]);

        return result.rows[0];
    }

    // subscriptions
    async follow(userId, subscriberId, timeSubscribe) {
        await db.query(`INSERT INTO subscriptions (user_id, subscriber_id, time_subscribe) VALUES ($1, $2, $3)`, [userId, subscriberId, timeSubscribe]);
    }

    async unFollow(userId, subscriberId) {
        await db.query(`DELETE FROM subscriptions WHERE user_id = $1 AND subscriber_id = $2`, [userId, subscriberId]);
    }

    async getUserSubscriber(userId, subscriberId) {
        const result = await db.query(`SELECT * FROM subscriptions WHERE user_id = $1 AND subscriber_id = $2`, [userId, subscriberId]);

        return result.rows[0];
    }

    async getUserSubscribers(userId) {
        const result = await db.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [userId]);

        return result.rows;
    }

    async getNumUserSubscribers(userId) {
        const countResult = await db.query(`SELECT count(*) FROM subscriptions WHERE user_id = $1`, [userId]);

        return countResult.rows[0].count;
    }

    async getUserSubscribers(userId) {
        const result = await db.query(`SELECT * FROM subscriptions WHERE user_id = $1`, [userId]);

        return result.rows;
    }

    async getUsersBySubscriber(subscriberId) {
        const result = await db.query(`SELECT * FROM subscriptions WHERE subscriber_id = $1`, [subscriberId]);

        return result.rows;
    }

    async getNumUsersBySubscriber(subscriberId) {
        const countResult = await db.query(`SELECT count(*) FROM subscriptions WHERE subscriber_id = $1`, [subscriberId]);

        return countResult.rows[0].count;
    }

    async removeUserSubscribers(userId) {
        await db.query(`DELETE FROM subscriptions WHERE user_id = $1`, [userId]);
    }

    // games
    async createGame(userId, timeStart, level) {
        // console.log(userId, timeStart, level);

        const result = await db.query(`INSERT INTO games (user_id, time_start, level) VALUES ($1, $2, $3) RETURNING *`, [userId, timeStart, level]);

        return result.rows[0];
    }

    async getGame(gameId) {
        const result = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);

        return result.rows[0];
    }

    async getAllGames(userId, count = 4, page = 1) {
        const totalCountResult = await db.query(`SELECT count(*) FROM games WHERE user_id = $1`, [userId]);
        const totalCount = totalCountResult.rows[0].count;

        const offset = count * (page - 1);

        const result = await db.query(`SELECT * FROM games WHERE user_id = $1 ORDER BY id DESC OFFSET $2 LIMIT $3`, [userId, offset, count]);

        return {totalCount, games: result.rows};
    }

    async getInProgressGames(userId, count = 4, page = 1) {
        const totalCountResult = await db.query(`SELECT count(*) FROM games WHERE time_end IS NULL AND user_id = $1`, [userId]);
        const totalCount = totalCountResult.rows[0].count;

        const offset = count * (page - 1);

        const result = await db.query(`SELECT * FROM games WHERE user_id = $1 AND time_end IS NULL ORDER BY id DESC OFFSET $2 LIMIT $3`, [userId, offset, count]);

        return {totalCount, games: result.rows};
    }

    async getCompletedGames(userId, count = 4, page = 1) {
        const totalCountResult = await db.query(`SELECT count(*) FROM games WHERE time_end IS NOT NULL AND user_id = $1`, [userId]);
        const totalCount = totalCountResult.rows[0].count;

        const offset = count * (page - 1);

        const result = await db.query(`SELECT * FROM games WHERE user_id = $1 AND time_end IS NOT NULL ORDER BY id DESC OFFSET $2 LIMIT $3`, [userId, offset, count]);

        return {totalCount, games: result.rows};
    }

    async getSuccessfulGames(userId, count = 4, page = 1) {
        const totalCountResult = await db.query(`SELECT count(*) FROM games WHERE is_won = true AND user_id = $1`, [userId]);
        const totalCount = totalCountResult.rows[0].count;

        const offset = count * (page - 1);

        const result = await db.query(`SELECT * FROM games WHERE user_id = $1 AND is_won = true ORDER BY id DESC OFFSET $2 LIMIT $3`, [userId, offset, count]);

        return {totalCount, games: result.rows};
    }

    async finishGame(gameId, timeEnd, isWon) {
        const result = await db.query(`UPDATE games SET time_end = $2, is_won = $3 WHERE id = $1 RETURNING *`, [gameId, timeEnd, isWon]);

        return result.rows[0];
    }

    // game_progress
    async createGameProgress(gameId, currentOrder = 'black', figuresJSON) {
        const result = await db.query(`INSERT INTO game_progress (game_id, current_order, figures) VALUES ($1, $2, $3) RETURNING *`, [gameId, currentOrder, figuresJSON]);

        return result.rows[0];
    }

    async getGameProgress(gameId) {
        const result = await db.query(`SELECT * FROM game_progress WHERE game_id = $1`, [gameId]);

        return result.rows[0];
    }

    async updateGameProgress(gameId, currentOrder, figuresJSON) {
        const result = await db.query(`UPDATE game_progress SET current_order = $2, figures = $3 WHERE game_id = $1 RETURNING *`, [gameId, currentOrder, figuresJSON]);

        return result.rows[0];
    }

    // chat_messages
    async addChatMessage(author, authorId, message, date) {
        const result = await db.query(`INSERT INTO chat_messages (author, author_id, message, date) VALUES ($1, $2, $3, $4) RETURNING *`, [author, authorId, message, date]);
        return [result.rows[0]];
    }

    async getLastMessages(count = 30) {
        const totalCountResult = await db.query(`SELECT count(*) FROM chat_messages`);
        const totalCount = totalCountResult.rows[0].count;

        let offset = totalCount - count;
        if (offset < 0) offset = 0;

        const result = await db.query(`SELECT * FROM chat_messages OFFSET $1`, [offset]);

        return result.rows;
    }

}

module.exports = new DAL();
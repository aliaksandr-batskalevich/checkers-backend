const db = require('./db.js');

class DAL {

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

    async getTopUsers(count = 10) {
        const result = await db.query(`SELECT * FROM users ORDER BY rating DESC LIMIT $1`, [count]);
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

}

module.exports = new DAL();
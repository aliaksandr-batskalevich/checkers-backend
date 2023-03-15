import db from './db.js';

class DAL {

    async registrationUser(username, hashPassword, email, activationLink) {

        const result = await db.query(`INSERT INTO users (username, password, email, activation_link, is_activated, games_count, games_wins_count, sparring_count, sparring_wins_count) VALUES ($1, $2, $3, $4, false, 0, 0, 0, 0) RETURNING *`, [username, hashPassword, email, activationLink]);

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

    async getAllUsers() {
        const result = await db.query(`SELECT * FROM users`);
        return result.rows;
    }

    async deleteUserById(id) {
        const result = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    }

    async refreshUsersToken(userId, refreshToken) {
        await db.query(`UPDATE users SET refresh_token = $2 WHERE id = $1`, [userId, refreshToken]);
    }

}

export default new DAL();
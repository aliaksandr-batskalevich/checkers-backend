import db from './db.js';

class DAL {
    async registrationUser(username, hashPassword) {
        const result = await db.query(`INSERT INTO users (username, password, games_count, games_wins_count, sparring_count, sparring_wins_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [username, hashPassword, 0, 0, 0, 0]);

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

    async getAllUsers() {
        const result = await db.query(`SELECT * FROM users`);
        return result.rows;
    }

    async checkUsernameIsAvailable(username) {
        const user = await this.getUserByName(username);
        return !user;
    }

    async deleteUserById(id) {
        const result = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    }

}

export default new DAL();
import pool from "./pool.js";
import { User } from "../types/index.js";
async function createUser(username: string, email: string, password_hash: string): Promise<User> {
    const result = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password_hash]
    );
    return result.rows[0];
}

async function getUserByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
}
async function getUserbyID(id: number): Promise<User | undefined> {
    const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
    );
    return result.rows[0];
}

async function updateRefreshToken(id: number, token: string): Promise<void> {
    await pool.query(
        "UPDATE users SET refresh_token = $1 WHERE id = $2",
        [token, id]
    );
}

async function deleteUser(id: number): Promise<void> {
    await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
    );
}

export { createUser, getUserByEmail, getUserbyID, updateRefreshToken, deleteUser }
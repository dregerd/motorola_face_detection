import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { CreateLogger } from '../util/logger';

export default class DatabaseClient {
    #logger = CreateLogger('Database Client');
    #connection;

    async getConnection() {
        if (this.#connection) {
            return this.#connection;
        }
        try {
            this.#logger.info("Creating db connection");
            const db = await open({
                filename: './face_detection.db',
                driver: sqlite3.Database
            });
            this.#connection = db;
            return db
        } catch (err) {
            this.#logger.error("Failed to get database connection", err);
        }
    }

    async createFaceIdRequest(imageLocation) {
    }

    async listRequests() {
    }

    async deleteRequest(id) {
    }

    async getRequest(id) {
    }

    async updateStatus(id, newStatus) {
    }
}
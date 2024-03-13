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

    /*
        Insert a new face detection request into the database
    */
    async createFaceIdRequest(imageLocation) {
        let connection = await this.getConnection();
        if (!connection) return null;

        this.#logger.info('Creating Face Detection Request');
        const query = "INSERT INTO face_detection(image_location) VALUES(:location);";
        try {
            // Using a prepared query to sanitize input
            const result = await connection.run(query, {":location": imageLocation});
            return {id: result.lastID}; // Return the id of the created item
        } catch (err) {
            this.#logger.error(err);
        }
    }

    /*
        List all face detection requests
    */
    async listRequests() {
        let connection = await this.getConnection();
        if (!connection) return null;

        const query = "SELECT * FROM face_detection;";
        try {
            const result = await connection.all(query);
            if (!result) return [];
            return result
        } catch (err) {
            this.#logger.error(err);
        }
    }

    async deleteRequest(id) {
    }

    async getRequest(id) {
    }

    async updateStatus(id, newStatus) {
    }
}
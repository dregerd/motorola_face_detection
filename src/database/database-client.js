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

    /*
        Delete a face detection request
    */
    async deleteRequest(id) {
        let connection = await this.getConnection();
        if (!connection) return null;

        const query = "DELETE FROM face_detection WHERE id = :id;";
        try {
            const result = await connection.run(query, {":id": id});
            return result.changes > 0; // true if we actually change something, otherwise nothing affected
        } catch (err) {
            this.#logger.error(err);
        }
    }

    /*
        Get a specific request from the db
    */
    async getRequest(id) {
        let connection = await this.getConnection();
        if (!connection) return null;

        const query = "SELECT * FROM face_detection WHERE id = :id;";
        try {
            const result = await connection.get(query, {":id": id});
            return result
        } catch (err) {
            this.#logger.error(err);
        }

    }

    /*
        Update the status of a request in the db
        This happens when the detection service finishes processing
    */
    async updateStatus(id, newStatus, faces) {
        let connection = await this.getConnection();
        if (!connection) return null;
        const query = "UPDATE face_detection SET status = :status, face_count = :faces WHERE id = :id";
        try {
            const result = await connection.run(query, {
                ":status": newStatus,
                ":faces": faces,
                ":id": id
            });
            return result.changes > 0; // if we didnt change anything, that means an improper id was given
        } catch (err) {
            this.#logger.error(err);
        }
    }
}
import express from 'express';
import DatabaseClient from '../database/database-client';
import { CreateLogger } from '../util/logger';
import { FaceDetectionRequestEvent } from '../services/face-detection-service';

const router = express.Router();
const logger = CreateLogger('Face Detection Router');
const dbClient = new DatabaseClient();


/*
    Creation endpoint for a request
    Expects image_location in the body
*/
router.post('/create', async (req, res) => {
    logger.info('Creating Face Detection Request', req.body);
    if (!req.body?.image_location) {
        res.status(400).send('{image_location: string} expected');
        return;
    }
    let result = await dbClient.createFaceIdRequest(req.body.image_location);
    logger.debug(result)
    if (result) {
        FaceDetectionRequestEvent.emit('new', result); // Trigger the face detection service to start working
        res.status(201).json(result);
        return;
    }
    res.status(500).send('Something went wrong');
});

/*
    List endpoint to get all requests in the system
*/
router.get('/list', async (req, res) => {
    logger.info('List Request Received');
    let result = await dbClient.listRequests();
    if (result) {
        res.json(result);
        return;
    }
    res.status(500).send('Something went wrong');
});

/*
    Get endpoint to get a specific request
    Expects id in the query parameter
*/
router.get('/get', async (req, res) => {
    logger.info('Get Request Received', req.query);
    if (!req.query['id']) {
        res.status(400).send('Expected id query parameter');
        return;
    }
    let result = await dbClient.getRequest(req.query['id']);
    if (result) {
        res.json(result);
        return;
    }
    res.status(404).send('Not found');
});

/*
    Deletion endpoint to delete a request
    Expects id query parameter
    This endpoint wont cancel an inprogress event if detection service has already picked it up
*/
router.delete('/delete', async (req, res) => {
    logger.info('Delete Request Received', req.query);
    if (!req.query['id']) {
        res.status(400).send('Expected id query parameter');
        return;
    }
    let result = await dbClient.deleteRequest(req.query['id']);
    if (result) {
        res.send('Successful deletion');
        return;
    }
    res.status(404).send('Not found');
});

export default router;
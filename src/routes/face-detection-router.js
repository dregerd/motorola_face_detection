import express from 'express';
import DatabaseClient from '../database/database-client';
import { CreateLogger } from '../util/logger';
const router = express.Router();
const logger = CreateLogger('Face Detection Router');
const dbClient = new DatabaseClient();


/*
    Creation endpoint for a request
    Expects imageLocation in the body
*/
router.post('/create', async (req, res) => {
    logger.info('Creating Face Detection Request', req.body);
    if (!req.body?.imageLocation) {
        res.status(400).send('{imageLocation: string} expected');
        return;
    }
    let result = await dbClient.createFaceIdRequest(req.body.imageLocation);
    logger.debug(result)
    if (result) {
        res.status(201).json(result);
        return;
    }
    res.status(500).send('Something went wrong');
});

/*
    List endpoint to get all requests in the system
*/
router.get('/list', async (req, res) => {
    let result = await dbClient.listRequests();
    if (result) {
        res.json(result);
        return;
    }
    res.status(500).send('Something went wrong');
});

/*
    Status endpoint to get a specific request
    Expects id in the query parameter
*/
router.get('/status', async (req, res) => {
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
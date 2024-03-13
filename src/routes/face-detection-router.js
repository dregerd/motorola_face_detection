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
router.get('/list', async (req, res) => {
    res.status(500).send('Something went wrong');
});

router.get('/status', async (req, res) => {
    res.status(404).send('Not found');
});
router.delete('/delete', async (req, res) => {
    res.status(404).send('Not found');
});

export default router;
import express from 'express';
import DatabaseClient from '../database/database-client';
import { CreateLogger } from '../util/logger';
const router = express.Router();
const logger = CreateLogger('Face Detection Router');
const dbClient = new DatabaseClient();

router.post('/create', async (req, res) => {
    logger.info('Creating Face Detection Request', req.body);
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
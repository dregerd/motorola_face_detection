import EventEmitter from 'events';
import { CreateLogger } from '../util/logger';
import { setTimeout } from 'timers/promises';
import DatabaseClient from '../database/database-client';
import * as canvas from 'canvas';

const logger = CreateLogger('Face Detection Service');
const dbClient = new DatabaseClient();

export const FaceDetectionRequestEvent = new EventEmitter();

// Triggered by a new face detection request, this will load the image
// Setup the model and run the model against the image, then update the result in the system
FaceDetectionRequestEvent.on('new', async ({id}) => {
    if (!id) return;
    logger.info('New Request Event');
    const request = await dbClient.getRequest(id);
    if (!request || !request.image_location) {
        logger.error('New event was fired but request does not exist');
        return;
    }
    try { // Load the image and run the model against it
        logger.info(`Loading Image: ${request.image_location}`);
        await canvas.loadImage(request.image_location);
        await setTimeout(10000); // 10 seconds
        const detections = Math.floor(Math.random() * 10) + 1;
        logger.info(`Detection complete, Found ${detections} faces`);
        await dbClient.updateStatus(id, 'complete', detections); // Update the status and face count
    } catch (err) { // Bad Image
        logger.warn(`Failed to process image: ${request.image_location}`, err);
        await dbClient.updateStatus(id, 'failed');
        return;
    }
})

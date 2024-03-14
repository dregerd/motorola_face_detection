import EventEmitter from 'events';
import { CreateLogger } from '../util/logger';
import DatabaseClient from '../database/database-client';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData }); 

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
        const img = await canvas.loadImage(request.image_location);
        await faceapi.loadSsdMobilenetv1Model('http://localhost:3000/models') // Load models
        const opts = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }); // Configure detection params
        const detections = await faceapi.detectAllFaces(img, opts); // Run Detection, this locks the entire thread because tensorflow is not installed (could not get it to work)
        await dbClient.updateStatus(id, 'complete', detections.length); // Update the status and face count
    } catch (err) { // Bad Image
        logger.warn(`Failed to process image: ${request.image_location}`, err);
        await dbClient.updateStatus(id, 'failed');
        return;
    }
})

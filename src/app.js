import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { CreateLogger } from './util/logger';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import fs from 'fs';

import faceDetection from './routes/face-detection-router';

const logger = CreateLogger('App');

logger.info('API starting up..')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Add Routes
app.use('/', faceDetection);


const swaggerFile = fs.readFileSync(path.join(__dirname, '../public/openapi.yaml'), 'utf8');
const swaggerConfig = yaml.parse(swaggerFile);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

export default app;

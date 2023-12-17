const cors = require('cors');
const cookieParser = require('cookie-parser');
import express, { Application } from 'express';
import apiRouter from './routes/api-router';

const app: Application = express();

const env = process.env.NODE_ENV
const corsOptions = {
    credentials: true,
    origin: (origin: string, callback: Function) => {
        if (env === 'test' || env === 'development') {
            callback(null, true);
        } else {
            const allowedOrigins = [process.env?.API_BASE_URL];
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('CORS not allowed'), false);
            }
        }
    }
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use('/api', apiRouter);

import { handlePsqErrors, handleCustomErrors, handleServerErrors } from './middlewares/error-handlers';
app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
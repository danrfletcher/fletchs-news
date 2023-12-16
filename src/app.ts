const cors = require('cors');
const cookieParser = require('cookie-parser');
import express, { Application } from 'express';
import apiRouter from './routes/api-router';

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api', apiRouter);

import { handlePsqErrors, handleCustomErrors, handleServerErrors } from './middlewares/error-handlers';
app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
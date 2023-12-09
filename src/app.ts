import express, { Application } from 'express';
const app: Application = express();

app.use(express.json());

const apiRouter = require('./routes/api-router.js');
app.use('/api', apiRouter);

import { handlePsqErrors, handleCustomErrors, handleServerErrors } from './middlewares/error-handlers';
app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
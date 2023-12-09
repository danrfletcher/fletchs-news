const express = require('express');
const app = express();

app.use(express.json());

const apiRouter = require('./routes/api-router.js');
app.use('/api', apiRouter);

const { handlePsqErrors, handleCustomErrors, handleServerErrors } = require('./middlewares/error-handlers.js');
app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
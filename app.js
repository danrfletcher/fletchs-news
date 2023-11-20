const express = require('express');
const app = express();

const { handlePsqErrors, handleCustomErrors, handleServerErrors } = require('./middlewares/error-handlers.js');
const { getTopics } = require('./controllers/topic-controllers.js');
const { getArticles } = require('./controllers/article-controllers.js');
const { getEndpoints } = require('./controllers/endpoint-controllers.js');

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
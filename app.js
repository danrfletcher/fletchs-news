const express = require('express');
const app = express();

const { handlePsqErrors, handleCustomErrors, handleServerErrors } = require('./middlewares/error-handlers.js');
const { getEndpoints } = require('./controllers/endpoint-controllers.js');
const { getTopics } = require('./controllers/topic-controllers.js');
const { getArticleByID } = require('./controllers/article-controllers.js');

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleByID);

app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
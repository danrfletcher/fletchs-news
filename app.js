const express = require('express');
const app = express();

const { handlePsqErrors, handleCustomErrors, handleServerErrors } = require('./middlewares/error-handlers.js');
const { getTopics } = require('./controllers/topic-controllers.js');
const { getArticles, getArticleByID, getCommentsByArticleID, changeVotesByArticleID } = require('./controllers/article-controllers.js');
const { getEndpoints } = require('./controllers/endpoint-controllers.js');

app.use(express.json());

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleByID);
app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

app.patch('/api/articles/:article_id', changeVotesByArticleID);

app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
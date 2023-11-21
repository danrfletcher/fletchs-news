const express = require('express');
const app = express();

const { handlePsqErrors, handleCustomErrors, handleServerErrors } = require('./middlewares/error-handlers.js');
const { getTopics } = require('./controllers/topic-controllers.js');
const { getArticles, getArticleByID, getCommentsByArticleID } = require('./controllers/article-controllers.js');
const { getEndpoints } = require('./controllers/endpoint-controllers.js');
const { deleteCommentByID } = require('./controllers/comment-controllers.js');


app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleByID);
app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

app.delete('/api/comments/:comment_id', deleteCommentByID);

app.use(handlePsqErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
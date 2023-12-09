const articlesRouter = require('express').Router();

const { getArticles, getArticleByID, getCommentsByArticleID, changeVotesByArticleID, postCommentByArticleID, postArticle } = require('../controllers/article-controllers.js');
articlesRouter.route('/:article_id')
    .get(getArticleByID)
    .patch(changeVotesByArticleID);
articlesRouter.route('/:article_id/comments')
    .post(postCommentByArticleID)
    .get(getCommentsByArticleID);
articlesRouter.route('/')
    .get(getArticles)
    .post(postArticle)

module.exports = articlesRouter;


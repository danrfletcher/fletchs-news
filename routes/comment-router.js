const commentsRouter = require('express').Router();

const { deleteCommentByID } = require('../controllers/comment-controllers.js');
commentsRouter.delete('/:comment_id', deleteCommentByID);

module.exports = commentsRouter;
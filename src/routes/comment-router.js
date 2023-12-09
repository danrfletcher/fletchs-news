const commentsRouter = require('express').Router();

const { deleteCommentByID, changeVotesByCommentID } = require('../controllers/comment-controllers.js');
commentsRouter.delete('/:comment_id', deleteCommentByID);
commentsRouter.route('/:comment_id')
    .delete(deleteCommentByID)
    .patch(changeVotesByCommentID);

module.exports = commentsRouter;
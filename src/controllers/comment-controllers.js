const { deleteComment, selectComment, updateCommentVotes } = require('../models/comment-models.js');

exports.deleteCommentByID = (req, res, next) => {
    const { comment_id } = req.params;
    deleteComment(comment_id).then((comment) => {
        res.status(204).end()
    })
   .catch(next);
};

exports.changeVotesByCommentID = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    selectComment(comment_id)
    .then(ifCommentIsValid => updateCommentVotes(comment_id, inc_votes))
    .then(votes => res.status(200).send(votes))
    .catch(next);
};

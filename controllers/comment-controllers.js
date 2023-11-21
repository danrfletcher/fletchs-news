const { deleteComment } = require('../models/comment-models.js');

exports.deleteCommentByID = (req, res, next) => {
    const { comment_id } = req.params;
    deleteComment(comment_id).then((comment) => {
        res.status(200).send({comment})
    })
   .catch(next);
};
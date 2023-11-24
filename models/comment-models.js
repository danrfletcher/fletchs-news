const db = require('../db/connection.js');
const format = require('pg-format');

exports.deleteComment = (comment_id) => {
    return db.query(format(`DELETE FROM comments WHERE comment_id = %L RETURNING *;`, comment_id))
    .then((comment) => {
        return comment.rows.length ? comment.rows[0] : Promise.reject({status: 404, msg: "comment not found"});
    });
};

exports.selectComment = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((comment) => {
        return comment.rows.length ? comment.rows[0] : Promise.reject({status: 404, msg: "comment not found"});
    });
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
    return inc_votes ? db.query(format(`UPDATE comments SET votes = votes + %s WHERE comment_id = %s RETURNING votes;`, inc_votes, comment_id)) 
   .then(votes => votes.rows[0]) : Promise.reject({status: 400, msg: "bad request"})
};
const db = require('../db/connection.js');
const format = require('pg-format');

exports.deleteComment = (comment_id) => {
    return db.query(format(`DELETE FROM comments WHERE comment_id = %L RETURNING *;`, comment_id))
    .then((comment) => {
        return comment.rows.length ? comment.rows[0] : Promise.reject({status: 404, msg: "comment not found"});
    });
}
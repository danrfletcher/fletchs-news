const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectArticle = (article_id) => {
    return db.query(format(`SELECT * FROM articles WHERE article_id = %L;`, [article_id]))
    .then((article) => {
        return article.rows.length ? article.rows[0] : Promise.reject({status: 404, msg: "article not found"});
    });
};

exports.postComment = (article_id, comment) => {
return db.query(format(
        `INSERT INTO comments (body, article_id, author, votes) VALUES (%L) RETURNING *;`
        , [comment.body, article_id, comment.author, 0]
    ))
    .then(comment => comment.rows[0]);
};
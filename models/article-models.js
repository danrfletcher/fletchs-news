const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectArticle = (article_id) => {
    return db.query(format(`SELECT * FROM articles WHERE article_id = %L;`, [article_id]))
    .then((article) => {
        return article.rows.length ? article.rows[0] : Promise.reject({status: 404, msg: "article not found"});
    });
};
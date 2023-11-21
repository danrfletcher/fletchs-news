const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectArticles = () => {
    return db.query(`
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `)
    .then(articlesWCommentCount => articlesWCommentCount.rows)

exports.selectArticle = (article_id) => {
    return db.query(format(`SELECT * FROM articles WHERE article_id = %L;`, [article_id]))
    .then((article) => {
        return article.rows.length ? article.rows[0] : Promise.reject({status: 404, msg: "article not found"});
    });
};
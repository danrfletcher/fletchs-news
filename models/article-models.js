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
};

exports.selectArticle = (article_id) => {
    return db.query(format(`SELECT * FROM articles WHERE article_id = %L;`, [article_id]))
    .then((article) => {
        return article.rows.length ? article.rows[0] : Promise.reject({status: 404, msg: "article not found"});
    });
};

exports.selectCommentsByArticleID = (article_id) => {
    return db.query(format(`SELECT * FROM comments WHERE article_id = %L;`, [article_id]))
    .then(comments => comments.rows)
};

exports.updateArticleVotes = (article_id, inc_votes) => {
    return inc_votes ? db.query(format(`UPDATE articles SET votes = votes + %s WHERE article_id = %s RETURNING votes;`, inc_votes, article_id))
   .then(votes => votes.rows[0]) : Promise.reject({status: 400, msg: "bad request"});
};
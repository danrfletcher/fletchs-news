const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectArticles = (query) => {
    
    //Check for invalid queries
    const checkQuery = Object.keys(query).filter(query => query!== 'topic').length
    if (checkQuery > 0) return Promise.reject({status: 400, msg: "bad request"});
    
    //Build db query string
    const { topic } = query;
    
    let queryStr = `        
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        `
    if (topic) queryStr += format(`WHERE articles.topic = %L`, [topic])
    
    queryStr += `
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `
    //Query db & return rows
    return db.query(queryStr)
    .then(articlesWCommentCount => articlesWCommentCount.rows)
};

exports.selectArticle = (article_id) => {
    return db.query(`
        SELECT articles.*, COUNT(comments.comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
        `, [article_id])
    .then((article) => {
        return article.rows.length ? article.rows[0] : Promise.reject({status: 404, msg: "article not found"});
    });
};

exports.postComment = (article_id, comment) => {
    const { author } = comment;
    if (!author) return Promise.reject({status: 400, msg: "bad request"});
    return db.query(format(
        `INSERT INTO comments (body, article_id, author, votes) VALUES (%L) RETURNING *;`
        , [comment.body, article_id, comment.author, 0]
    ))
    .then(comment => comment.rows[0]);
}

exports.selectCommentsByArticleID = (article_id) => {
    return db.query(format(`SELECT * FROM comments WHERE article_id = %L;`, [article_id]))
    .then(comments => comments.rows)
};

exports.updateArticleVotes = (article_id, inc_votes) => {
    return inc_votes ? db.query(format(`UPDATE articles SET votes = votes + %s WHERE article_id = %s RETURNING votes;`, inc_votes, article_id))
   .then(votes => votes.rows[0]) : Promise.reject({status: 400, msg: "bad request"});
};


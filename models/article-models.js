const db = require('../db/connection.js');
const format = require('pg-format');
const endpoints = require('../endpoints.json');



exports.selectArticles = (fullQuery) => {
    const {'GET /api/articles': {queries}} = endpoints;
    const validQueries = queries;
    const areAllQueriesValid = Object.keys(fullQuery).map((individualQuery) => Object.values(validQueries).includes(individualQuery))
    
    //Check for invalid queries
    const checkQuery = Object.keys(fullQuery).filter(individualQuery => individualQuery!== 'topic' && individualQuery !== 'sort_by' ).length
    if (areAllQueriesValid.includes(false)) return Promise.reject({status: 400, msg: "bad request"});
    
    //Build db fullQuery string
    let { topic, sort_by, order } = fullQuery;
    
    //Assign default values for absent queries
    if (!sort_by) sort_by = 'created_at';
    if (!order || (order.toUpperCase() !== 'DESC' && order.toUpperCase() !== 'ASC')) order = 'DESC';
    order = order.toUpperCase();
    
    let queryStr = `        
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        `
    if (topic) queryStr += format(`WHERE articles.topic = %L`, [topic])
    
    queryStr += `GROUP BY articles.article_id `
    queryStr += format(`ORDER BY %I %s;`, sort_by, order)

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



exports.selectColumnHeader = (columnHeader) => {
    return db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'articles' AND COLUMN_NAME = $1;`, [columnHeader])
    .then((columnHeader) => {
        return columnHeader.rows.length ? columnHeader.rows[0] : Promise.reject({status: 404, msg: "sort_by parameter does not exist"})
    });
}
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
    let { topic, sort_by, order, limit, p } = fullQuery;
    
    //Assign default values for absent queries
    let offset = `;`
    if (!sort_by) sort_by = 'created_at';
    if (!order || (order.toUpperCase() !== 'DESC' && order.toUpperCase() !== 'ASC')) order = 'DESC';
    if (!limit) limit = 10;
    if (p) offset = format(` OFFSET %s;`, (p-1)*limit);
    order = order.toUpperCase();
    
    let queryStr = `        
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        `
    if (topic) queryStr += format(`WHERE articles.topic = %L`, [topic])
    
    queryStr += `GROUP BY articles.article_id `
    queryStr += format(`ORDER BY %I %s `, sort_by, order)
    queryStr += format(`LIMIT %s`, limit)
    queryStr += offset;

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

    .then((comment) => {
        return comment.rows[0]
    });
}



exports.selectCommentsByArticleID = (article_id, fullQuery) => {
    let { limit, p } = fullQuery;
    
    let offset = ';';
    if (!limit) limit = 10;
    if (p) offset = format(` OFFSET %s;`, (p-1)*limit);

    let queryStr = format(`SELECT * FROM comments WHERE article_id = %L `, [article_id])
    queryStr += format(` ORDER BY created_at DESC`);
    queryStr += format(` LIMIT %s`, limit)
    queryStr += offset;

    return db.query(queryStr)
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
};


exports.createArticle = (article) => {
    let { title, topic, author, body, article_img_url } = article;
    
    //Provides default image if one is not included
    if (!article_img_url) article_img_url = "https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png";

    //Checks all properties present in request body
    if (!title ||!topic ||!author ||!body) return Promise.reject({status: 400, msg: "bad request"});

    return db.query(format(`
        INSERT INTO articles (title, topic, author, body, votes, article_img_url)
        VALUES (%L, %L, %L, %L, 0, %L) RETURNING *;
    `, title, topic, author, body, article_img_url))
    .then((article) => {
        return article.rows[0]
    })
};
const db = require('../db/connection.js');

exports.selectArticles = () => {
    return db.query('SELECT * FROM articles;')
    .then(articles => articles.rows);
};
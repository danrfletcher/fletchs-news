const db = require('../db/connection.js');

exports.selectArticles = () => {
    const articlesPromise = db.query('SELECT * FROM articles ORDER BY created_at DESC;')
    const commentCountPromise = db.query('SELECT * FROM comments;')
    return Promise.all([articlesPromise, commentCountPromise])
    .then(([articles, comments]) => {
        const articlesWCommentCount = articles.rows.map((article) => {
            article.comment_count = comments.rows.filter(comment => comment.article_id === article.article_id).length;
            delete article.body;
            return article;
        })
        return articlesWCommentCount;
    });
};
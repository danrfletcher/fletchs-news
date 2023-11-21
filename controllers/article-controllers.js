const { selectArticle, postComment } = require('../models/article-models.js');

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    selectArticle(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
};

exports.postCommentByArticleID = (req, res, next) => {
    const comment = req.body;
    const { article_id } = req.params;
    Promise.all([selectArticle(article_id), postComment(article_id, comment)])
    .then(([article, comment]) => {
        res.status(201).send({comment})
    })
    .catch(next);
}
const { selectArticles } = require('../models/article-models.js');

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    }) 
    .catch(next)

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    selectArticle(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
};
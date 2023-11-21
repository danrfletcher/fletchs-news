const { selectArticles, selectArticle, selectCommentsByArticleID } = require('../models/article-models.js');

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

exports.getCommentsByArticleID = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([selectArticle(article_id), selectCommentsByArticleID(article_id)])
    .then(([article, comments]) => {
         res.status(200).send({comments})
    })
   .catch(next);
};
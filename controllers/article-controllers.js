const { selectArticles } = require('../models/article-models.js');

exports.getArticles = (req, res, next) => {
    selectArticles().then(articles => res.status(200).send({ articles }))
    .catch(next)
};
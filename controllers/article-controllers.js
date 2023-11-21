const { selectUser } = require('../models/user-models.js');
const { selectArticles, selectArticle, selectCommentsByArticleID, updateArticleVotes, postComment } = require('../models/article-models.js');

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles })
    }) 
    .catch(next)
};

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    selectArticle(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
};

exports.postCommentByArticleID = (req, res, next) => {
    const comment = req.body;
    const { author } = comment;
    const { article_id } = req.params;
    Promise.all([selectArticle(article_id), selectUser(author), postComment(article_id, comment)])
    .then(([article, author, comment]) => {
        res.status(201).send({comment})
    })
    .catch(next);
}

exports.getCommentsByArticleID = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([selectArticle(article_id), selectCommentsByArticleID(article_id)])
    .then(([article, comments]) => {
         res.status(200).send({comments})
    })
   .catch(next);
};

exports.changeVotesByArticleID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    Promise.all([selectArticle(article_id), updateArticleVotes(article_id, inc_votes)])
    .then(([article, votes]) => res.status(200).send(votes))
    .catch(next);
};


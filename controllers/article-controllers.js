const { selectUser } = require('../models/user-models.js');
const { selectArticles, selectArticle, selectCommentsByArticleID, updateArticleVotes, postComment } = require('../models/article-models.js');
const { selectTopic } = require('../models/topic-models.js');

exports.getArticles = (req, res, next) => {
    
    //Add any queries to array of promises to validate
    const query = req.query;
    let promises = [selectArticles(query)];
    
    const { topic } = query;
    if (topic) promises.push(selectTopic(topic));

    //Query model & validate queries, then send response
    Promise.all(promises)
    .then((responses) => {
        const articles = responses[0]
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
    selectArticle(article_id)
    .then((ifArticleIsValid) => selectUser(author))
    .then((ifUserAndArticleAreValid) => postComment(article_id, comment))
    .then(comment => res.status(201).send({ comment }))
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

exports.changeVotesByArticleID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    Promise.all([selectArticle(article_id), updateArticleVotes(article_id, inc_votes)])
    .then(([article, votes]) => res.status(200).send(votes))
    .catch(next);
};


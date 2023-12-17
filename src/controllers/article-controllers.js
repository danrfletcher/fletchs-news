const { selectUser } = require('../models/user-models.js');
//import { selectUser } from '../models/user-models';
const { selectArticles, selectArticle, selectCommentsByArticleID, updateArticleVotes, postComment, selectColumnHeader, createArticle } = require('../models/article-models.js');
const { selectTopic } = require('../models/topic-models.js');

exports.getArticles = async (req, res, next) => {
    try {
        // Add any queries to array of promises to validate
        const query = req.query;
        let promises = [];

        const { topic, sort_by } = query;
        if (topic) promises.push(selectTopic(topic));
        if (sort_by) promises.push(selectColumnHeader(sort_by));

        // Query model & validate queries, then send response
        const validationsComplete = await Promise.all(promises);
        const articles = await selectArticles(query);

        res.status(200).send({ articles });
    } catch (error) {
        next(error);
    }
};

exports.getArticleByID = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const article = await selectArticle(article_id)
        res.status(200).send({article})
    } catch (error) {
        next(error);
    }
};

exports.postCommentByArticleID = async (req, res, next) => {
    try {
        const comment = req.body;
        const { author } = comment;
        const { article_id } = req.params;
        
        const ifArticleIsValid = await selectArticle(article_id);
        const ifUserAndArticleAreValid = await selectUser(author);
        const userMatchesAuthor = req.user.name === author
        
        if (userMatchesAuthor) {
            const postedComment = await postComment(article_id, comment);
            res.status(201).send({ comment: postedComment });
        } else {
            return Promise.reject({status: 401, msg: "unauthorized access"});
        }
        
    } catch (error) {
        next(error);
    }
};


exports.getCommentsByArticleID = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const query = req.query

        const [article, comments] = await Promise.all([
            selectArticle(article_id),
            selectCommentsByArticleID(article_id, query)
        ]);

        res.status(200).send({ comments });
    } catch (error) {
        next(error);
    }
};


exports.changeVotesByArticleID = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const { inc_votes } = req.body;

        const ifArticleIsValid = await selectArticle(article_id);
        const votes = await updateArticleVotes(article_id, inc_votes);

        res.status(200).send(votes);
    } catch (error) {
        next(error);
    }
};


exports.postArticle = async (req, res, next) => {
    try {
        const article = req.body;

        // Checks author & topic exist
        const { author, topic } = article;

        const ifAuthorIsValid = await selectUser(author);
        const ifAuthorAndTopicAreValid = await selectTopic(topic);
        const postedArticle = await createArticle(article);

        // Respond with posted article & all props
        res.status(201).send({ article: postedArticle });
    } catch (error) {
        next(error);
    }
};


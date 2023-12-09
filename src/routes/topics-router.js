const topicsRouter = require('express').Router();

const { getTopics } = require('../controllers/topic-controllers.js');
topicsRouter.get('/', getTopics);

module.exports = topicsRouter;
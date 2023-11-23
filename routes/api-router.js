const apiRouter = require('express').Router();

const articlesRouter = require('./article-router.js');
const commentsRouter = require('./comment-router.js');
const usersRouter = require('./user-router.js');
const topicsRouter = require('./topics-router.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);

const { getEndpoints } = require('../controllers/endpoint-controllers.js');
apiRouter.get('/', getEndpoints);

module.exports = apiRouter;
import { Router } from 'express';

import articlesRouter from './article-router';
import commentsRouter from './comment-router';
import usersRouter from './user-router'
import topicsRouter from './topics-router'
import tokenRouter from './token-router'

const apiRouter = Router();

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/token', tokenRouter)

const { getEndpoints } = require('../controllers/endpoint-controllers.js');
apiRouter.get('/', getEndpoints);
/**
 * @openapi
 * /api:
 *   get:
 *     tags:
 *       - Endpoints
 *     description: Responds with a list of available endpoints on this API.
 *     responses:
 *       200:
 *         description: List of available endpoints on this API.
 */


export default apiRouter;
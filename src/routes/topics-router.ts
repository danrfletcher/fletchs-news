import { Router } from 'express';
const topicsRouter = Router();

const { getTopics } = require('../controllers/topic-controllers.js');
topicsRouter.get('/', getTopics);
/**
 * @openapi
 * /api/topics:
 *   get:
 *     tags:
 *       - Endpoints
 *     description: Serves an array of all topics.
 *     responses:
 *       200:
 *         description: Array of topics.
 *         content:
 *           application/json:
 *             example:
 *               topics:
 *                 - slug: football
 *                   description: Footie!
 */


export default topicsRouter;
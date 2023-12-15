import { Router } from 'express';
import { getToken } from '../controllers/token-controller';

export const tokenRouter = Router();

tokenRouter.post('/token', getToken);
/**
 * @openapi
 * /token:
 *   post:
 *     tags:
 *       - Tokens
 *     description: Responds with a new user access token.
 *     responses:
 *       200:
 *         description: User access token.
 */

export default tokenRouter
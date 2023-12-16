import { Router } from 'express';
import { getToken } from '../controllers/token-controller';

export const tokenRouter = Router();

tokenRouter.post('/', getToken);
/**
 * @openapi
 * /api/token:
 *   post:
 *     summary: Responds with user access token
 *     tags:
 *       - Authentication
 *     description: Generates a new access token using the provided refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: User's refresh token
 *     responses:
 *       200:
 *         description: Successfully generated access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Newly generated user access token
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
 */

export default tokenRouter
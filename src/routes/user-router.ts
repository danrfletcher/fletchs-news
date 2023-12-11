import { Router } from 'express';
const usersRouter = Router();

const { getUsers, getUser } = require('../controllers/user-controllers.js');
usersRouter.get('/', getUsers);
/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Serves an array of all users.
 *     responses:
 *       200:
 *         description: Array of all users.
 *         content:
 *           application/json:
 *             exampleResponse:
 *               users: [
 *                 {
 *                   user_id: 1,
 *                   username: "butter_bridge",
 *                   name: "johnny",
 *                   avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
 *                 },
 *                 {
 *                   user_id: 2,
 *                   username: "icellusedkars",
 *                   email: "sam",
 *                   avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
 *                 }
 *               ]
 */
usersRouter.get('/:username', getUser);
/**
 * @openapi
 * /api/users/{username}:
 *   get:
 *     tags:
 *       - Users
 *     description: Serves a single user by username.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to retrieve.
 *     responses:
 *       200:
 *         description: Details of the requested user.
 *         content:
 *           application/json:
 *             exampleResponse:
 *               user: {
 *                 user_id: 1,
 *                 username: "butter_bridge",
 *                 name: "johnny",
 *                 avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
 *               }
 */



export default usersRouter;
import { Router } from 'express';
const usersRouter = Router();
import { getUser, getUsers, postUser, loginUser, logoutUser, logoutAllUserInstances } from '../controllers/user-controllers';

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
usersRouter.post('/', postUser);
/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     description: Adds a new user to the database, returning the user excluding their hashed password.
 *     responses:
 *       201:
 *         description: New user object.
 *         content: 
 *           application/json:
 *             exampleResponse:
 *               user: {
 *                 user_id: 10,
 *                 username: new_user,
 *                 name: "john",
 *                 avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
 *                 }
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
usersRouter.post('/login', loginUser)
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logs the user into their account
 *     description: Allows a user to log in using their username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "username"
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "grumpy19"
 *                     name:
 *                       type: string
 *                       example: "Paul Grump"
 *                     avatar_url:
 *                       type: string
 *                       example: "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - when username or password is incorrect
 */
usersRouter.delete('/logout', logoutUser)
usersRouter.delete('/logout-all', logoutAllUserInstances)

export default usersRouter;
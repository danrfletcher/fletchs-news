import { Router } from 'express';

const { deleteCommentByID, changeVotesByCommentID } = require('../controllers/comment-controllers.js');

const commentsRouter = Router();

commentsRouter.delete('/:comment_id', deleteCommentByID);
commentsRouter.route('/:comment_id')
    .delete(deleteCommentByID)
    /**
     * @openapi
     * /api/comments/{comment_id}:
     *   delete:
     *     tags:
     *       - Comments
     *     description: Deletes an existing comment by ID.
     *     parameters:
     *       - in: path
     *         name: comment_id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Comment deleted successfully.
     */
    .patch(changeVotesByCommentID);
    /**
     * @openapi
     * /api/comments/{comment_id}:
     *   patch:
     *     tags:
     *       - Comments
     *     description: Updates an existing comment votes by ID.
     *     parameters:
     *       - in: path
     *         name: comment_id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Comment updated successfully.
     *         content:
     *           application/json:
     *             exampleResponse:
     *               comment: {
     *                 comment_id: 1,
     *                 comment: "Updated comment",
     *                 author: "butter_bridge",
     *                 created_at: "2020-07-09T20:11:00.000Z",
     *                 article_id: 1
     *               }
     */


export default commentsRouter;
import { Router } from 'express';

const { getArticles, getArticleByID, getCommentsByArticleID, changeVotesByArticleID, postCommentByArticleID, postArticle } = require('../controllers/article-controllers.js');

const articlesRouter = Router();

articlesRouter.route('/:article_id')
    .get(getArticleByID)    
    /**
     * @openapi
     * /api/articles/{article_id}:
     *   get:
     *     tags:
     *       - Articles
     *     description: Serves a single article by ID.
     *     parameters:
     *       - in: path
     *         name: article_id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the article to retrieve.
     *     responses:
     *       200:
     *         description: Details of the requested article.
     *         content:
     *           application/json:
     *             example:
     *               article:
     *                 article_id: 1
     *                 title: "Living in the shadow of a great man"
     *                 topic: "mitch"
     *                 author: "butter_bridge"
     *                 body: "I find this existence challenging"
     *                 created_at: "2020-07-09T20:11:00.000Z"
     *                 votes: 100
     *                 article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
     *                 comment_count: "11"
     */
    .patch(changeVotesByArticleID);
    /**
     * @openapi
     * /api/articles/{article_id}:
     *   patch:
     *     tags:
     *       - Articles
     *     description: Updates an existing article by ID.
     *     parameters:
     *       - in: path
     *         name: article_id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the article to be updated.
     *     responses:
     *       200:
     *         description: Updated article.
     *         content:
     *           application/json:
     *             example:
     *               article:
     *                 article_id: 1
     *                 title: "Living in the shadow of a great man"
     *                 topic: "mitch"
     *                 author: "butter_bridge"
     *                 body: "I find this existence challenging"
     *                 created_at: "2020-07-09T20:11:00.000Z"
     *                 votes: 100
     *                 article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
     *                 comment_count: "11"
     */

    articlesRouter.route('/:article_id/comments')
    .post(postCommentByArticleID)
    /**
     * @openapi
     * /api/articles/{article_id}/comments:
     *   post:
     *     tags:
     *       - Comments
     *     description: Creates a new comment for a given article.
     *     parameters:
     *       - in: path
     *         name: article_id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the article for which the comment is created.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           example:
     *             comment: "This is a comment"
     *             author: "butter_bridge"
     *     responses:
     *       200:
     *         description: Created comment.
     *         content:
     *           application/json:
     *             example:
     *               comment:
     *                 comment_id: 1
     *                 comment: "This is a comment"
     *                 author: "butter_bridge"
     *                 created_at: "2020-07-09T20:11:00.000Z"
     *                 article_id: 1
     */
    .get(getCommentsByArticleID);
    /**
     * @openapi
     * /api/articles/{article_id}/comments:
     *   get:
     *     tags:
     *       - Articles
     *     description: |
     *       Retrieves a paginated list of comments for a given article.
     *       Supports pagination using query parameters: limit (default: 10) and p (page).
     *     parameters:
     *       - in: path
     *         name: article_id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the article for which to retrieve comments.
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Number of comments to retrieve (default: 10).
     *       - in: query
     *         name: p
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number for paginated results (calculated using limit).
     *     responses:
     *       200:
     *         description: Paginated list of comments for the specified article.
     *         content:
     *           application/json:
     *             example:
     *               comments:
     *                 - comment_id: 1
     *                   comment: "This is a comment"
     *                   author: "butter_bridge"
     *                   created_at: "2020-07-09T20:11:00.000Z"
     *                   article_id: 1
     *                 - comment_id: 2
     *                   comment: "This is another comment"
     *                   author: "butter_bridge"
     *                   created_at: "2020-07-09T20:11:00.000Z"
     *                   article_id: 1
     *       400:
     *         description: Bad request. Invalid parameters provided.
     *       404:
     *         description: Article not found.
     */

    articlesRouter.route('/')
    .get(getArticles)
    /**
     * @openapi
     * /api/articles:
     *   get:
     *     tags:
     *       - Endpoints
     *     description: Serves an array of all articles.
     *     parameters:
     *       - in: query
     *         name: topic
     *         description: Filter by topic.
     *         schema:
     *           type: string
     *       - in: query
     *         name: sort_by
     *         description: Sort by a specific column.
     *         schema:
     *           type: string
     *       - in: query
     *         name: order
     *         description: Sorting order (asc or desc).
     *         schema:
     *           type: string
     *       - in: query
     *         name: limit
     *         description: Limit the number of results.
     *         schema:
     *           type: integer
     *       - in: query
     *         name: p
     *         description: Pagination page.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Array of articles.
     *         content:
     *           application/json:
     *             example:
     *               articles:
     *                 - article1: Article 1 info
     *                 - article2: Article 2 info
     *                 - article3: Article 3 info
     */
    .post(postArticle)
    /**
     * @openapi
     * /api/articles:
     *   post:
     *     tags:
     *       - Articles
     *     description: Creates a new article.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           example:
     *             title: "New Article"
     *             topic: "new_topic"
     *             author: "new_author"
     *             body: "This is a new article."
     *     responses:
     *       200:
     *         description: Created article.
     *         content:
     *           application/json:
     *             example:
     *               article:
     *                 article_id: 1
     *                 title: "New Article"
     *                 topic: "new_topic"
     *                 author: "new_author"
     *                 body: "This is a new article."
     *                 created_at: "2020-01-01T00:00:00.000Z"
     *                 votes: 0
     *                 article_img_url: null
     *                 comment_count: 0
     */

export default articlesRouter;


const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const request = require('supertest');
const app = require('../app.js');

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe('GET Requests', () => {
    describe('GET /api', () => {
        test('/api 200: responds with a list of all available endpoints', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then((res) => {
                const endpoints = require('../endpoints.json');
                expect(res.body.endpoints).toEqual(endpoints);
                Object.keys(res.body.endpoints).forEach((endpoint) => {
                    expect(res.body.endpoints[endpoint].hasOwnProperty('description')).toBe(true);
                    expect(res.body.endpoints[endpoint].hasOwnProperty('queries')).toBe(true);
                    expect(res.body.endpoints[endpoint].hasOwnProperty('exampleResponse')).toBe(true);
                });
            });
        });
    });
    describe('GET /api/topics', () => {
        test('/api/topics 200: responds with all topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((res) => {
                expect(res.body.topics).toHaveLength(3);
                res.body.topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe('string');
                    expect(typeof topic.description).toBe('string');
                });
            });
        });
    });
    describe('GET /api/articles', () => {
        test('/api/articles 200: responds with all articles & associated comment counts', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
            //Check Correct Length
            expect(res.body.articles.length).toBeGreaterThanOrEqual(13);
            //Check Sort Order
            expect(res.body.articles).toBeSorted('created_at', 'desc');
            expect(res.body.articles[12].title).toBe("Z");
            //Check each element has correct props
            res.body.articles.forEach((article) => {
                expect(typeof article.title).toBe('string');
                expect(typeof article.topic).toBe('string');
                expect(typeof article.author).toBe('string');
                expect(typeof article.body).toBe('undefined'); //Check body has been removed
                expect(typeof article.created_at).toBe('string');
                expect(typeof article.article_img_url).toBe('string');
                expect(typeof article.comment_count).toBe('string');
            });
        });
    });
    });  
    describe('GET /api/articles/:article_id', () => {
        test('/api/articles/:article_id 200: responds with valid article object', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
                expect(res.body.article.article_id).toBe(1);
                expect(res.body.article.title).toBe('Living in the shadow of a great man');
                expect(res.body.article.topic).toBe('mitch');
                expect(res.body.article.author).toBe('butter_bridge');
                expect(res.body.article.body).toBe('I find this existence challenging');
                expect(res.body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
                expect(res.body.article.votes).toBe(100);
                expect(res.body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
            });
        });
        test('/api/articles/:article_id 404: responds with a 404 error if article does not exist', () => {
            return request(app)
            .get('/api/articles/1000')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('article not found');
            })
        });
        test('/api/articles/:article_id 400: responds with a 400 error if article is not a number', () => {
            return request(app)
            .get('/api/articles/not-a-number')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('bad request');
            })
        });
    })
    describe('GET /api/articles/article_id/comments', () => {
        test('/api/articles/:article_id/comments 200: responds with a list of all comments for an article', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((res) => {
                expect(res.body.comments.length).toBeGreaterThanOrEqual(11);
                expect(res.body.comments).toBeSorted('created_at', 'desc')
                res.body.comments.forEach((comment) => {
                    expect(comment).toEqual(expect.objectContaining({
                        comment_id: expect.any(Number),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        author: expect.any(String),
                        created_at: expect.any(String),
                    }));
                });
            });
        });
        test('/api/articles/:article_id/comments 404: responds with a 404 error if article does not exist', () => {
            return request(app)
            .get('/api/articles/1000/comments')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('article not found');
            });
        });
        test('/api/articles/:article_id/comments 400: responds with a 400 error if aritcle id is not a number', () => {
            return request(app)
            .get('/api/articles/not-a-number/comments')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('bad request');
            });
        });
        test('/api/articles/:article_id/comments 200: responds with a 200 & empty array if article exists but has no comments', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then((res) => {
                expect(res.body.comments).toEqual([]);
            });
        });
    });
});

describe('DELETE Requests', () => {
    describe('DELETE /api/comments/:comment_id', () => {
        test('/api/comments/:comment_id 204: successfully deletes the comment', () => {
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
        });
        test('/api/comments/:comment_id 404: responds with a 404 error when ID is not valid', () => {
            return request(app)
            .delete('/api/comments/1000000')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('comment not found');
            });
        });
        test('/api/comments/:comment_id 400: responds with a 400 error when ID is not a number', () => {
            return request(app)
            .delete('/api/comments/not-a-number')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('bad request');
            });
        });
    });
});

describe('PATCH Requests', () => {
    describe('PATCH /api/articles/:article_id', () => {
        test('/api/articles/:article_id 200: responds with modified property & correctly increments votes', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then((res) => {
                expect(res.body.votes).toBe(101);
            });
        });
        test('/api/articles/:article_id 404: responds with a 404 error if article does not exist', () => {
            return request(app)
            .patch('/api/articles/1000')
            .send({ inc_votes: 1 })
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('article not found');
            });
        });
        test('/api/articles/:article_id 400: responds with a 400 error if article id is not a number', () => {
            return request(app)
            .patch('/api/articles/not-a-number')
            .send({ inc_votes: 1 })
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('bad request');
            });
        });
        test('/api/articles/:article_id 400: responds with a 400 error if the request body is invalid', () => {
            return request(app)
           .patch('/api/articles/1')
           .send({ bad_request: 1 })
           .expect(400)
           .then((res) => {
                expect(res.body.msg).toBe('bad request');
            });
        });
    });
  });


describe('POST Requests', () => {
    test('/api/articles/:article_id/comments 201: responds with a 201 status code if comment is successfully added', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            body: 'Wew, I loved this article!',
            author: "butter_bridge",
        })
        .expect(201)
        .then((res) => {
            expect(res.body.comment.body).toBe('Wew, I loved this article!');
            expect(res.body.comment.author).toBe('butter_bridge');
            expect(res.body.comment.comment_id).toBe(19);
            expect(res.body.comment.article_id).toBe(1);
            expect(res.body.comment.votes).toBe(0);
            expect(typeof res.body.comment.created_at).toBe('string');
        });
    });
    test('/api/articles/:article_id/comments 404: responds with a 404 error if article does not exist', () => {
        return request(app)
        .post('/api/articles/1000/comments')
        .send({
            body: 'Wew, I loved this article!',
            author: "butter_bridge",
        })
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('article not found');
        });
    });
    test('/api/articles/:article_id/comments 400: responds with a 400 error code if the article is not a number', () => {
        return request(app)
        .post('/api/articles/not-a-number/comments')
        .send({
            body: 'Wew, I loved this article!',
            author: "butter_bridge",
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('bad request');
        });
    });
    test('/api/articles/:article_id/comments 201: responds with a 201 status code if comment is successfully added & additional properties were on the object & were excluded', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            body: 'Wew, I loved this article!',
            author: "butter_bridge",
            excluded_prop: "Hello there",
            another_excluded_prop: "this should be excluded",
        })
        .expect(201)
        .then((res) => {
            expect(res.body.comment.body).toBe('Wew, I loved this article!');
            expect(res.body.comment.author).toBe('butter_bridge');
            expect(res.body.comment.comment_id).toBe(21);
            expect(res.body.comment.article_id).toBe(1);
            expect(res.body.comment.votes).toBe(0);
            expect(typeof res.body.comment.created_at).toBe('string');
        });
    });
    test('/api/articles/:article_id/comments 400: responds with a 400 error code if the request body is missing the username property', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            body: 'Wew, I loved this article!',
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('bad request');
        });
    });
    test('/api/articles/:article_id/comments 404: responds with a 404 error if the username in the request body does not exist', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            body: 'Wew, I loved this article!',
            author: "does_not_exist",
        })
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('user not found');
        });
    });
});




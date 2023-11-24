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
        test('/api/articles?topic=valid-topic 200: returns articles filtered by a valid topic', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then((res) => {
                //Check Correct Length
                expect(res.body.articles.length).toBeGreaterThanOrEqual(12);
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
            })
        });
        test('/api/articles?topic=valid-topic 200: returns articles sorted correctly', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then((res) => {
                //Check Sort Order
                expect(res.body.articles).toBeSorted('created_at', 'desc');
            })
        });
        test('/api/articles?topic=invalid-topic 404: returns 404 if queried topic does not exist', () => {
            return request(app)
            .get('/api/articles?topic=invalid-topic')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('topic not found');
            })
        });
        test('/api/articles?topic=valid-but-no-articles 200: returns empty array if topic exists but contains no articles', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toHaveLength(0);
            });
        });
        test('/api/articles?sort_by=valid-param 200: returns articles sorted by a valid-param descending (default)', () => {
            return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('title', {descending: true});
            });
        });
        test('/api/articles?sort_by=valid-param&order=asc 200: returns articles sorted by a valid-param ascending', () => {
            return request(app)
            .get('/api/articles?sort_by=title&order=asc')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('title', {asscending: true});
            });
        });
        test('/api/articles?sort_by=valid-param&order=desc 200: returns articles sorted by a valid-param descending', () => {
            return request(app)
            .get('/api/articles?sort_by=title&order=desc')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('title', {descending: true});
                });
        });    
        test('/api/articles?sort_by=invalid-param 404: returns sort_by parameter does not exist', () => {
            return request(app)
            .get('/api/articles?sort_by=invalid-param')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('sort_by parameter does not exist');
            });
        });
        test('/api/articles?sort_by=invalid-param&order=invalid-param 200: discards bad order param & defaults to descending', () => {
            return request(app)
            .get('/api/articles?sort_by=title&order=invalid-param')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('title', {descending: true});
            });
        });
        test('/api/articles?order=asc 200: returns articles sorted by default ascending', () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('created_at', {ascending: true});
            });
        });
        test('/api/articles?order=desc 200: returns articles sorted by default descending', () => {
            return request(app)
            .get('/api/articles?order=desc')
            .expect(200)
            .then((res) => {
                expect(res.body.articles).toBeSortedBy('created_at', {descending: true});
            });
        });
        test('/api/articles?invalid-param 400: returns bad request if starting query param is invalid', () => {
            return request(app)
            .get('/api/articles?invalid-param')
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('bad request');
            })
        });
    });  
    describe('GET /api/articles/:article_id', () => {
        test('/api/articles/:article_id 200: responds with valid article object with comment count', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
                expect(res.body.article).toEqual(expect.objectContaining({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: "11"
                }));
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
    describe('GET /api/users', () => {
        test('/api/users 200: responds with a list of all users', () => {
            return request(app)
           .get('/api/users')
           .expect(200)
           .then((res) => {
                expect(res.body.users.length).toBeGreaterThanOrEqual(4);
                res.body.users.forEach((user) => {
                    expect(user).toEqual(expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    }));
                });
            });
        });
    });
    describe('GET /api/users/:username', () => {
        test('/api/users/:username 200: responds with valid username object when it exists', () => {
            return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then((res) => {
                expect(res.body.user).toEqual(expect.objectContaining({
                    username: 'butter_bridge',
                    name: 'jonny',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                }));
            })
        });
        test('/api/users/:username 404: responds with a 404 when username does not exist', () => {
            return request(app)
            .get('/api/users/not-a-username')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('user not found');
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
            expect(res.body.comment.comment_id).toBe(20);
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




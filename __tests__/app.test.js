const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const request = require('supertest');
const app = require('../app.js');

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe('GET Requests', () => {
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
    test('/api/articles/:article_id 200: responds with valid article object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
            expect(res.body.article_id).toBe(1);
            expect(res.body.title).toBe('Living in the shadow of a great man');
            expect(res.body.topic).toBe('mitch');
            expect(res.body.author).toBe('butter_bridge');
            expect(res.body.body).toBe('I find this existence challenging');
            expect(res.body.created_at).toBe('2020-07-09T20:11:00.000Z');
            expect(res.body.votes).toBe(100);
            expect(res.body.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
        })
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
    })
});
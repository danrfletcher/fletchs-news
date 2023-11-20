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
            expect(Object.keys(res.body.endpoints)).toHaveLength(3); //This length will need to be changed as more endpoints are added
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
});
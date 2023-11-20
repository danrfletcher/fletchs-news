const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const request = require('supertest');
const app = require('../app.js');

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('200: responds with all topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
            expect(res.body.topics).toHaveLength(3);
            res.body.topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string');
            })
        })
    });
});
const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(topics => topics.rows);
};
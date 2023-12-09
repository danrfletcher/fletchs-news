const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(topics => topics.rows);
};

exports.selectTopic = (topic) => {
    return db.query('SELECT * FROM topics WHERE slug = $1;', [topic])
    .then((topic) => {
        return topic.rows.length ? topic.rows[0] : Promise.reject({status: 404, msg: "topic not found"});
    });
};
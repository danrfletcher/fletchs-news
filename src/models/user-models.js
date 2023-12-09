const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then(users => users.rows);
};

exports.selectUser = (username) => {
    if (!username) return Promise.reject({status: 400, msg: "bad request"});

    return db.query(format(`SELECT * FROM users WHERE username = %L;`, [username]))
   .then((user) => {
    return user.rows.length? user.rows[0] : Promise.reject({status: 404, msg: "user not found"});
   });
};


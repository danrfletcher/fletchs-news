const db = require('../db/connection.js');
const format = require('pg-format');

exports.selectUser = (username) => {
    return db.query(format(`SELECT * FROM users WHERE username = %L;`, [username]))
   .then((user) => {
    return user.rows.length? user.rows[0] : Promise.reject({status: 404, msg: "user not found"});
   });
};
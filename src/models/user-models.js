const db = require('../db/connection.js');
const format = require('pg-format');
const argon2 = require('argon2');

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

exports.checkUsername = (username) => {
    if (!username) return Promise.reject({status: 400, msg: "bad request"});

    return db.query(format(`SELECT * FROM users WHERE username = %L;`, [username]))
   .then((user) => {
    return user.rows.length > 0 ? Promise.reject({status: 409, msg: "username already exists"}) : "username is available";
   });
}

exports.createUser = async (user) => {
    try {
        const {username, name, avatar_url, password} = user;
        if (!username || !name || !avatar_url || !password) return Promise.reject({status: 400, msg: "bad request"});

        const hashPass = await argon2.hash(password);

        const newUser = await db.query(format(`
            INSERT INTO users (username, name, avatar_url, password)
            VALUES (%L, %L, %L, %L) RETURNING *;
        `, username, name, avatar_url, hashPass))

        return newUser.rows[0];
    } catch (error) {
        throw error;
    }

}


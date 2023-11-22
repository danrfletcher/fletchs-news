const { selectUsers } = require('../models/user-models.js');

exports.getUsers = (req, res, next) => {
    selectUsers().then(users => res.status(200).send({users}));
};
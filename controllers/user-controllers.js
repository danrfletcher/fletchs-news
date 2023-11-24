const { selectUsers, selectUser } = require('../models/user-models.js');

exports.getUsers = (req, res, next) => {
    selectUsers().then(users => res.status(200).send({users}));
};

exports.getUser = (req, res, next) => {
    const { username } = req.params;
    selectUser(username).then((user) => {
        res.status(200).send({user})
    })
    .catch(next)
};
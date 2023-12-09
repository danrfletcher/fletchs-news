const usersRouter = require('express').Router();

const { getUsers, getUser } = require('../controllers/user-controllers.js');
usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUser);

module.exports = usersRouter;
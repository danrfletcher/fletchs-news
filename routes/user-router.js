const usersRouter = require('express').Router();

const { getUsers } = require('../controllers/user-controllers.js');
usersRouter.get('/', getUsers);

module.exports = usersRouter;
const { selectTopics } = require('../models/topic-models.js');

exports.getTopics = (req, res, next) => {
    selectTopics().then(topics => res.status(200).send({ topics }))
    .catch(next)
};
const newTopicController = require('../controllers/newTopic.controller');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/newtopic',
        handler: newTopicController.get
    });

    app.route({
        method: 'POST',
        url: '/newtopic',
        handler: newTopicController.post
    });
};
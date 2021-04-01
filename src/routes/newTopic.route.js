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
        schema: {
            body: {
                type: "object",
                properties: {
                    title: {type: 'string', nullable: false},
                    description: {type: 'string', nullable: false}
                },
                required: ['title','description']
            }
        },
        handler: newTopicController.post
    });
};
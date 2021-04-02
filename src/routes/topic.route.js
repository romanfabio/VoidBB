const newTopicController = require('../controllers/newTopic.controller');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/newtopic',
        schema: {
            querystring: {
                type: "object",
                properties: {
                    f: {type: 'integer', nullable: false}
                },
                required: ['f']
            }
        },
        handler: newTopicController.get
    });

    app.route({
        method: 'POST',
        url: '/newtopic',
        schema: {
            querystring: {
                type: "object",
                properties: {
                    f: {type: 'integer', nullable: false}
                },
                required: ['f']
            },
            body: {
                type: "object",
                properties: {
                    name: {type: 'string', nullable: false},
                    description: {type: 'string', nullable: false}
                },
                required: ['name', 'description']
            }
        },
        handler: newTopicController.post
    });
};
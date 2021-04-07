const viewForumController = require('../controllers/viewForum.controller');
const newForumController = require('../controllers/newForum.controller');
const getMeHook = require('./hooks/getMeHook');

module.exports = (app) => {

    app.route({
        method: 'GET',
        url: '/f/:name',
        schema: {
            params: {
                type: "object",
                properties: {
                    name: {type: "string"}
                },
                required: ['name']
            }
        },
        handler: viewForumController.get
    });

    app.route({
        method: 'GET',
        url: '/f',
        handler: newForumController.get,
        onRequest: getMeHook
    });

    app.route({
        method: 'POST',
        url: '/f',
        schema: {
            body: {
                type: "object",
                properties: {
                    name: {type: 'string', nullable: false},
                    description: {type: 'string', nullable: false}
                },
                required: ['name','description']
            }
        },
        handler: newForumController.post,
        onRequest: getMeHook
    });
};
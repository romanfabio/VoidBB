const newPostController = require('../controllers/newPost.controller');
const viewPostController = require('../controllers/viewPost.controller');
const getMeHook = require('./hooks/getMeHook');

module.exports = (app) => {

    app.route({
        method: 'GET',
        url: '/p/:id',
        schema: {
            params: {
                type: "object",
                properties: {
                    id: {type: "integer"}
                },
                required: ['id']
            }
        },
        handler: viewPostController.get,
        onRequest: getMeHook
    });

    app.route({
        method: 'GET',
        url: '/p',
        schema: {
            querystring: {
                type: "object",
                properties: {
                    f: {type: 'string', nullable: false},
                },
                required: ['f']
            }
        },
        handler: newPostController.get,
        onRequest: getMeHook
    });

    app.route({
        method: 'POST',
        url: '/p',
        schema: {
            querystring: {
                type: "object",
                properties: {
                    f: {type: 'string', nullable: false},
                },
                required: ['f']
            },
            body: {
                type: "object",
                properties: {
                    title: {type: 'string', nullable: false},
                    description: {type: 'string', nullable: false}
                },
                required: ['title','description']
            }
        },
        handler: newPostController.post,
        onRequest: getMeHook
    });
};
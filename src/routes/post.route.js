const newPostController = require('../controllers/newPost.controller');
const viewPostController = require('../controllers/viewPost.controller');
const isAuthHook = require('./hooks/isAuthHook');
const viewHook = require('./hooks/viewHook');
const messageHook = require('./hooks/messageHook');
const globalHook = require('./hooks/globalHook');

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
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'POST',
        url: '/p/:id',
        schema: {
            params: {
                type: "object",
                properties: {
                    id: {type: "integer"}
                },
                required: ['id']
            },
            body: {
                type: "object",
                properties: {
                    description: {type: 'string', nullable: false}
                },
                required: ['description']
            }
        },
        handler: viewPostController.post,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook]
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
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
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
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });
};
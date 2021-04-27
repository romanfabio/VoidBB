const viewForumController = require('../controllers/viewForum.controller');
const newForumController = require('../controllers/newForum.controller');
const isAuthHook = require('./hooks/isAuthHook');
const viewHook = require('./hooks/viewHook');
const messageHook = require('./hooks/messageHook');
const globalHook = require('./hooks/globalHook');

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
        handler: viewForumController.get,
        onRequest: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'GET',
        url: '/f',
        handler: newForumController.get,
        onRequest: [isAuthHook, viewHook, messageHook, globalHook] 
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
        onRequest: [isAuthHook, viewHook, messageHook, globalHook] 
    });
};
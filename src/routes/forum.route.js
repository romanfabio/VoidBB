const viewForumController = require('../controllers/viewForum.controller');
const newForumController = require('../controllers/newForum.controller');
const fSettingsController = require('../controllers/fSettings.controller');
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
                    name: {type: "string", nullable: false}
                },
                required: ['name']
            }
        },
        handler: viewForumController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'GET',
        url: '/f',
        handler: newForumController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
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
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'GET',
        url: '/fsettings/:name',
        schema: {
            params: {
                type: 'object',
                properties: {
                    name: {type: 'string', nullable: false}
                },
                required: ['name']
            }
        },
        handler: fSettingsController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'POST',
        url: '/fsettings/:name',
        schema: {
            params: {
                type: 'object',
                properties: {
                    name: {type: 'string', nullable: false}
                },
                required: ['name']
            }
        },
        body: {
            type: "object",
            properties: {
                action: {type: 'string', nullable: false}
            },
            required: ['action']
        },
        handler: fSettingsController.post,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });
};
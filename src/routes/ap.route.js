const apGeneralController = require('../controllers/apGeneral.controller');
const apLoginController = require('../controllers/apLogin.controller');
const apPermissionController = require('../controllers/apPermission.controller');
const isAuthHook = require('./hooks/isAuthHook');
const viewHook = require('./hooks/viewHook');
const messageHook = require('./hooks/messageHook');
const globalHook = require('./hooks/globalHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/ap/general',
        handler: apGeneralController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'POST',
        url: '/ap/general',
        schema: {
            body: {
                type: "object",
                properties: {
                    board_name: {type: 'string', nullable: false}
                },
                required: ['boardName']
            }
        },
        handler: apGeneralController.post,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'GET',
        url: '/ap',
        handler: apLoginController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'POST',
        url: '/ap',
        schema: {
            body: {
                type: "object",
                properties: {
                    username: {type: 'string', nullable: false},
                    password: {type: 'string', nullable: false}
                },
                required: ['password']
            }
        },
        handler: apLoginController.post,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'GET',
        url: '/ap/pex',
        handler: apPermissionController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'POST',
        url: '/ap/pex',
        schema: {
            body: {
                type: "object",
                properties: {}
            }
        },
        handler: apPermissionController.post,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook]
    });
};
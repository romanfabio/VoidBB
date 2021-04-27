const apGeneralController = require('../controllers/apGeneral.controller');
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
                required: ['board_name']
            }
        },
        handler: apGeneralController.post,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });
};
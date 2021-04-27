const viewUserController = require('../controllers/viewUser.controller');
const isAuthHook = require('./hooks/isAuthHook');
const viewHook = require('./hooks/viewHook');
const messageHook = require('./hooks/messageHook');
const globalHook = require('./hooks/globalHook');

module.exports = (app) => {

    app.route({
        method: 'GET',
        url: '/u/:username',
        schema: {
            params: {
                type: "object",
                properties: {
                    username: {type: "string"}
                },
                required: ['username']
            }
        },
        handler: viewUserController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });
};
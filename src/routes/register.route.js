const registerController = require('../controllers/register.controller');
const isAuthHook = require('./hooks/isAuthHook');
const viewHook = require('./hooks/viewHook');
const messageHook = require('./hooks/messageHook');
const globalHook = require('./hooks/globalHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/register',
        handler: registerController.get,
        onRequest: [isAuthHook, viewHook, messageHook, globalHook] 
    });

    app.route({
        method: 'POST',
        url: '/register',
        schema: {
            body: {
                type: "object",
                properties: {
                    username: {type: 'string', nullable: false},
                    email: {type:'string', nullable: false},
                    password: {type: 'string', nullable: false}
                },
                required: ['username','email','password']
            }
        },
        handler: registerController.post,
        onRequest: [isAuthHook, viewHook, messageHook, globalHook] 
    });
};
const loginController = require('../controllers/login.controller');
const isAuthHook = require('./hooks/isAuthHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/login',
        handler: loginController.get,
        onRequest: isAuthHook
    });

    app.route({
        method: 'POST',
        url: '/login',
        schema: {
            body: {
                type: "object",
                properties: {
                    username: {type: 'string', nullable: false},
                    password: {type: 'string', nullable: false},
                    back: {type: 'string', nullable: false}
                },
                required: ['username','password']
            }
        },
        handler: loginController.post,
        onRequest: isAuthHook
    });
};
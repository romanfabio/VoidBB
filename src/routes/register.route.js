const registerController = require('../controllers/register.controller');
const isAuthHook = require('./hooks/isAuthHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/register',
        handler: registerController.get,
        onRequest: isAuthHook
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
        onRequest: isAuthHook
    });
};
const loginController = require('../controllers/login.controller');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/login',
        handler: loginController.get
    });

    app.route({
        method: 'POST',
        url: '/login',
        schema: {
            body: {
                type: "object",
                properties: {
                    username: {type: 'string', nullable: false},
                    password: {type: 'string', nullable: false}
                },
                required: ['username','password']
            }
        },
        handler: loginController.post
    });
};
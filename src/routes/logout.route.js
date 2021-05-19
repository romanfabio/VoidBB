const logoutController = require('../controllers/logout.controller');
const apLoginController = require('../controllers/apLogin.controller');
const isAuthHook = require('./hooks/isAuthHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/logout',
        handler: logoutController.get,
        preHandler: isAuthHook
    });

    app.route({
        method: 'GET',
        url: '/ap/logout',
        handler: apLoginController.logout,
        preHandler: isAuthHook
    });
};
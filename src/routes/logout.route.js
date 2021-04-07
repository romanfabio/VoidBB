const logoutController = require('../controllers/logout.controller');
const isAuthHook = require('./hooks/isAuthHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/logout',
        handler: logoutController.get,
        onRequest: isAuthHook
    });
};
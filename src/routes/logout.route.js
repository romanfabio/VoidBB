const logoutController = require('../controllers/logout.controller');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/logout',
        handler: logoutController.get
    });
};
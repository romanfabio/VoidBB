const registerController = require('../controllers/register.controller');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/register',
        handler: registerController.get
    });

    app.route({
        method: 'POST',
        url: '/register',
        handler: registerController.post
    });
};
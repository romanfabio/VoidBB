const homeController = require('../controllers/home.controller');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/',
        handler: homeController.get
    });
};
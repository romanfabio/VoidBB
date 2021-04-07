const homeController = require('../controllers/home.controller');
const getMeHook = require('./hooks/getMeHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/',
        handler: homeController.get,
        onRequest: getMeHook 
    });
};
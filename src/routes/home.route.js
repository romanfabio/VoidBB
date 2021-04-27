const homeController = require('../controllers/home.controller');
const isAuthHook = require('./hooks/isAuthHook');
const viewHook = require('./hooks/viewHook');
const messageHook = require('./hooks/messageHook');
const globalHook = require('./hooks/globalHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/',
        handler: homeController.get,
        preHandler: [isAuthHook, viewHook, messageHook, globalHook] 
    });
};
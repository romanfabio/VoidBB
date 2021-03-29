const homeRoute = require('./home.route');
const newTopicRoute = require('./newTopic.route');
const registerRoute = require('./register.route');
const loginRoute = require('./login.route');
const logoutRoute = require('./logout.route');

module.exports = (app) => {
    homeRoute(app);
    newTopicRoute(app);
    registerRoute(app);
    loginRoute(app);
    logoutRoute(app);
}
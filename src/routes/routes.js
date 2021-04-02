const homeRoute = require('./home.route');
const topicRoute = require('./topic.route');
const registerRoute = require('./register.route');
const loginRoute = require('./login.route');
const logoutRoute = require('./logout.route');
const forumRoute = require('./forum.route');

module.exports = (app) => {
    homeRoute(app);
    topicRoute(app);
    registerRoute(app);
    loginRoute(app);
    logoutRoute(app);
    forumRoute(app);
}
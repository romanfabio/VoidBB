const homeRoute = require('./home.route');
const registerRoute = require('./register.route');
const loginRoute = require('./login.route');
const logoutRoute = require('./logout.route');
const forumRoute = require('./forum.route');
const postRoute = require('./post.route');
const userRoute = require('./user.route');
const apRoute = require('./ap.route');

module.exports = (app) => {
    homeRoute(app);
    registerRoute(app);
    loginRoute(app);
    logoutRoute(app);
    forumRoute(app);
    postRoute(app);
    userRoute(app);
    apRoute(app);
}
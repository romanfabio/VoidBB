const homeRoute = require('./home.route');
const newTopicRoute = require('./newTopic.route');

module.exports = (app) => {
    homeRoute(app);
    newTopicRoute(app);
}
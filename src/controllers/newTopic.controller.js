const db = require('../config/db');

module.exports = {
    get: (request, reply) => {
        reply.view('newTopic.ejs', {title: 'New Topic'});
    },

    post: (request, reply) => {
        db.insertPost(request.body);
        reply.redirect('/');
    }
}
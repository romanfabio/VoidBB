const db = require('../config/db');

module.exports = {
    get: (request, reply) => {
        reply.view('register.ejs', {title: 'Register'});
    },

    post: (request, reply) => {
        db.insertUser(request.body);
        reply.redirect('/');
    }
}
const db = require('../config/db');

module.exports = {
    get: (request, reply) => {
        reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: db.getAllPosts(), users: db.getAllUsers()});
    }
}
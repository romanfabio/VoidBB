const db = require('../config/db');

module.exports = {
    get: (request, reply) => {
        reply.view('home.ejs', {title: 'Home', posts: db.getAllPosts()});
    }
}
const db = require('./../config/db');

module.exports = (request, reply) => {
    const posts = db.getAllPosts();
    reply.view('index.ejs', {title: 'Home', posts});
};
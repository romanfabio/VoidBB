const db = require('../config/db');

module.exports = {
    get: (request, reply) => {
        const auth = request.session.get('username');

        if(!auth)
            reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: db.getAllPosts(), users: db.getAllUsers()});
        else
            reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: db.getAllPosts(), users: db.getAllUsers(), auth: {username: auth}});
    }
}
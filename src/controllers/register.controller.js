const db = require('../config/db');
const bcrypt = require('bcrypt');

module.exports = {
    get: (request, reply) => {
        reply.view('register.ejs', {title: 'Register'});
    },

    post: (request, reply) => {
        let data = request.body;
        
        bcrypt.hash(data.password, 10, (err, hash) => {
            if(err)
                console.log('Bcrypt failed');
            else {
                data.password = hash;
                db.insertUser(data);
                reply.redirect('/');
            }
        });
    }
}
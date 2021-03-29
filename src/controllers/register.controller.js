const db = require('../config/db');
const bcrypt = require('bcrypt');
const fieldValidator = require('../util/authenticationFieldValidator');
const validator = require('validator');

module.exports = {
    get: (request, reply) => {
        reply.view('register.ejs', {title: 'Register'});
    },

    post: (request, reply) => {
        const data = request.body;
        data.username = validator.trim(data.username);
        data.password = validator.trim(data.password);
        data.email = validator.trim(data.email);
        
        if(!fieldValidator.isEmailValid(data.email)) {
            reply.view('register.ejs', {title: 'Register', error: "Email is invalid"});
        } else if(!fieldValidator.isPasswordValid(data.password)) {
            reply.view('register.ejs', {title: 'Register', error: "Password is invalid"});
        } else if(!fieldValidator.isUsernameValid(data.username)) {
            reply.view('register.ejs', {title: 'Register', error: "Username is invalid"});
        } else {
            bcrypt.hash(data.password, 10, (err, hash) => {
                if(err) {
                    request.log.info(err);
                    reply.view('register.ejs', {title: 'Register', error: "An error has occured, retry later"})
                }
                else {
                    data.password = hash;
                    db.insertUser(data);
                    request.session.set('username', data.username);
                    reply.redirect('/');
                }
            });
        }
    }
}
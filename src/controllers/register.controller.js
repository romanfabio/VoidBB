const db = require('../database/db');
const bcrypt = require('bcrypt');
const fieldValidator = require('../util/fieldValidator');
const validator = require('validator');

module.exports = {
    get: (request, reply) => {
        const viewParams = { title: 'Register' };

        if(request.isAuth)
            reply.redirect('/');
        else
            reply.view('register.ejs', viewParams);
    },

    post: (request, reply) => {
        if(request.isAuth) {
            reply.redirect('/');
            return;
        }

        const viewParams = { title: 'Register' };

        const data = request.body;
        data.username = validator.trim(data.username);
        data.password = validator.trim(data.password);
        data.email = validator.trim(data.email);
        
        if(!fieldValidator.isEmailValid(data.email)) {
            viewParams.error = 'Invalid email';
            reply.view('register.ejs', viewParams);
        } else if(!fieldValidator.isPasswordValid(data.password)) {
            viewParams.error = 'Invalid password';
            reply.view('register.ejs', viewParams);
        } else if(!fieldValidator.isUsernameValid(data.username)) {
            viewParams.error = 'Invalid username';
            reply.view('register.ejs', viewParams);
        } else {
            bcrypt.hash(data.password, 10, (err, hash) => {
                if(err) {
                    request.log.info(err);
                    viewParams.error = 'An error has occured, retry later';
                    reply.view('register.ejs', viewParams);
                } else {
            
                    const UserModel = db.getUserModel();

                    UserModel.create({username: data.username, password: hash, email: data.email}).then((value) => {
                        request.session.set('username', data.username);
                        reply.redirect('/');
                    }, (err) => {
                        request.log.info(err);
                        viewParams.error = 'An error has occured, retry later';
                        reply.view('register.ejs', viewParams);
                    });
                }
            });
        }
    }
}
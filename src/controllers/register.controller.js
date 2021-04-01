const db = require('../database/db');
const bcrypt = require('bcrypt');
const fieldValidator = require('../util/fieldValidator');
const validator = require('validator');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {

        if(request.isAuth)
            reply.redirect('/');
        else
            viewer.register(reply, {});
    },

    post: (request, reply) => {
        if(request.isAuth) {
            reply.redirect('/');
            return;
        }

        const data = request.body;
        data.username = validator.trim(data.username);
        data.password = validator.trim(data.password);
        data.email = validator.trim(data.email);
        
        if(!fieldValidator.isEmailValid(data.email)) {
            viewer.register(reply, {error: 'Invalid email'});
        } else if(!fieldValidator.isPasswordValid(data.password)) {
            viewer.register(reply, {error: 'Invalid password'});
        } else if(!fieldValidator.isUsernameValid(data.username)) {
            viewer.register(reply, {error: 'Invalid username'});
        } else {
            bcrypt.hash(data.password, 10, (err, hash) => {
                if(err) {
                    request.log.info(err);
                    viewer.register(reply, {error: 'An error has occured, retry later'});
                } else {
            
                    const UserModel = db.getUserModel();

                    UserModel.create({username: data.username, password: hash, email: data.email}).then((value) => {
                        request.session.set('username', data.username);
                        reply.redirect('/');
                    }, (err) => {
                        request.log.info(err);
                        viewer.register(reply, {error: 'An error has occured, retry later'});
                    });
                }
            });
        }
    }
}
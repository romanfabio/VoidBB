const db = require('../database/db');
const bcrypt = require('bcrypt');
const variableManager = require('../util/variableManager');
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

        const viewParams = {};

        const data = request.body;
        data.username = validator.trim(data.username);
        data.password = validator.trim(data.password);
        data.email = validator.trim(data.email);
        
        if(!validator.isEmail(data.email)) {

            viewParams.error = 'Invalid email';
            viewer.register(reply, viewParams);

        } else if(!validator.isStrongPassword(data.password) || 
                    data.password.length < variableManager.get('PASSWORD_MIN_LENGTH') ||
                    data.password.length > variableManager.get('PASSWORD_MAX_LENGTH')) {

            viewParams.error = 'Invalid password';
            viewer.register(reply, viewParams);

        } else if(!validator.isAscii(data.username) || 
                    (!validator.matches(data.username,  /^[a-zA-Z_][0-9a-zA-Z_]*$/)) ||
                    data.username.length < variableManager.get('USERNAME_MIN_LENGTH') ||
                    data.username.length > variableManager.get('USERNAME_MAX_LENGTH')) {

            viewParams.error = 'Invalid username';
            viewer.register(reply, viewParams);

        } else {

            bcrypt.hash(data.password, 10, (err, hash) => {
                if(err) {
                    request.log.info(err);
                    viewParams.error = 'An error has occured, retry later';
                    viewer.register(reply, viewParams);
                } else {
            
                    const UserModel = db.getUserModel();

                    UserModel.create({username: data.username, password: hash, email: data.email}).then((value) => {
                        request.session.set('username', data.username);
                        reply.redirect('/');
                    }, (err) => {
                        request.log.info(err);
                        viewParams.error = 'An error has occured, retry later';
                        viewer.register(reply, viewParams);
                    });
                }
            });
        }
    }
}
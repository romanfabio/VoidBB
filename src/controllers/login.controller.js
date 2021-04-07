const db = require('../database/db');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { Op } = require('sequelize');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {
        if(request.is_auth) // L'utente autenticato non ha bisogno di autenticarsi di nuovo
            reply.redirect('/');
        else
            viewer.login(reply, {});
    },

    post: (request, reply) => {

        // L'utente autenticato non ha bisogno di autenticarsi di nuovo
        if(request.is_auth) {
            reply.redirect('/');
            return;
        }

        const viewParams = {};

        const data = request.body;

        // Rimuovi eventuali spazi 'bianchi'
        data.username = data.username.trim();
        data.password = data.password.trim();

        const UserModel = db.getUserModel();

        UserModel.findByPk(data.username, {attributes: ['password']})
            .then((user) => {
                if(user === null) {
                    viewParams.error = 'Username and/or password invalid';
                    viewer.login(reply, viewParams);
                } else {

                    bcrypt.compare(data.password, user.password, (err, result) => {
                        if(err) {
                            request.log.info(err);
                            viewParams.error = 'An error has occured, retry later';
                            viewer.login(reply, viewParams);
                        } else {
                            if(result) {
                                request.session.set('username', data.username);
                                reply.redirect('/');
                            } else {
                                viewParams.error = 'Username and/or password invalid';
                                viewer.login(reply, viewParams);
                            }
                        }
                    });
                }
            }, (err) => {
                console.log(err);
                viewParams.error = 'An error has occured, retry later';
                viewer.login(reply, viewParams);
            });
        
    }
}
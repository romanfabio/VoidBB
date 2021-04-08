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
            reply.view('login.ejs');
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
                    reply.view('login.ejs', {error: 'Username and/or password invalid'});
                } else {

                    bcrypt.compare(data.password, user.password, (err, result) => {
                        if(err) {
                            console.log(err);
                            reply.view('login.ejs', {error: 'An error has occured, retry later'});
                        } else {
                            if(result) {
                                request.session.set('username', data.username);
                                reply.redirect('/');
                            } else {
                                reply.view('login.ejs', {error: 'Username and/or password invalid'});
                            }
                        }
                    });
                }
            }, (err) => {
                console.log(err);
                reply.view('login.ejs', {error: 'An error has occured, retry later'});
            });
        
    }
}
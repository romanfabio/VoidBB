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
        data.username = validator.trim(data.username);
        data.password = validator.trim(data.password);

        const UserModel = db.getUserModel();

        UserModel.findAll({
            attributes: ['password'],
            where: {
                username: {
                    [Op.eq]: data.username
                }
            }
        }).then((value) => {
            if(value.length == 1) {
                bcrypt.compare(data.password, value[0].password, (err, result) => {
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
            } else {
                viewParams.error = 'Username and/or password invalid';
                viewer.login(reply, viewParams);
            }
        }, (err) => {
            request.log.info(err);
            viewParams.error = 'An error has occured, retry later';
            viewer.login(reply, viewParams);
        });
        
    }
}
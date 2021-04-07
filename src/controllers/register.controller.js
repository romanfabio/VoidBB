const db = require('../database/db');
const bcrypt = require('bcrypt');
const variableManager = require('../util/variableManager');
const validator = require('../util/validator');
const viewer = require('../util/viewer');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.is_auth) // L'utente autenticato non ha bisogno di autenticarsi di nuovo
            reply.redirect('/');
        else if (pex.isGlobalSet(pex.defaultGlobalGroup.Anonymous, pex.globalBit.REGISTER)) { // Controlla se il gruppo Anonymous ha il permesso di registrarsi
            viewer.register(reply, {});
        } else {
            viewer.home(reply, {error: 'You don\'t have the permission'});
        }
    },

    post: (request, reply) => {

        // L'utente autenticato non ha bisogno di autenticarsi di nuovo
        if(request.is_auth) {
            reply.redirect('/');
            return;
        }

        // Controlla se il gruppo Anonymous ha il permesso di registrarsi
        if(!pex.isGlobalSet(pex.defaultGlobalGroup.Anonymous, pex.globalBit.REGISTER)) {
            viewer.home(reply, {error: 'You don\'t have the permission'});
            return;
        }

        const viewParams = {};

        const data = request.body;
        
        data.email = data.email.trim();
        if(validator.isEmail(data.email)) {

            data.password = data.password.trim();
            if(validator.isPassword(data.password)) {

                data.username = data.username.trim();
                if(validator.isUsername(data.username)) {

                    bcrypt.hash(data.password, 10, (err, hash) => {
                        if(err) {
                            request.log.info(err);
                            viewParams.error = 'An error has occured, retry later';
                            viewer.register(reply, viewParams);
                        } else {
                    
                            const UserModel = db.getUserModel();
        
                            UserModel.create({username: data.username, password: hash, email: data.email, global_group: pex.defaultGlobalGroup.Registered_User}).then((value) => {
                                request.session.set('username', data.username);
                                reply.redirect('/');
                            }, (err) => {
                                request.log.info(err);
                                viewParams.error = 'An error has occured, retry later';
                                viewer.register(reply, viewParams);
                            });
                        }
                    });

                } else {
                    viewParams.error = 'Invalid username';
                    viewer.register(reply, viewParams);
                }
            } else {
                viewParams.error = 'Invalid password';
                viewer.register(reply, viewParams);            
            }
        } else {
            viewParams.error = 'Invalid email';
            viewer.register(reply, viewParams);
        }

    }
}
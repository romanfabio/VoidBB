const db = require('../database/db');
const bcrypt = require('bcrypt');
const variableManager = require('../util/variableManager');
const validator = require('validator');
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

        // Rimuovi eventuali spazi 'bianchi'
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
        }
    }
}
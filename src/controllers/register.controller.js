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
            reply.view('register.ejs');
        } else {
            reply.redirect('/');
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
            reply.redirect('/');
            return;
        }

        const data = request.body;
        
        data.email = data.email.trim();
        if(validator.isEmail(data.email)) {

            data.password = data.password.trim();
            if(validator.isPassword(data.password)) {

                data.username = data.username.trim();
                if(validator.isUsername(data.username)) {

                    bcrypt.hash(data.password, 10, (err, hash) => {
                        if(err) {
                            console.log(err);
                            reply.view('register.ejs', {error: 'An error has occured, retry later'});
                        } else {
                    
                            const UserModel = db.getUserModel();
        
                            UserModel.create({username: data.username, password: hash, email: data.email, global_group: pex.defaultGlobalGroup.Registered_User}).then((value) => {
                                request.session.set('username', data.username);
                                reply.redirect('/');
                            }, (err) => {
                                console.log(err);
                                reply.view('register.ejs', {error: 'An error has occured, retry later'});
                            });
                        }
                    });

                } else {
                    reply.view('register.ejs', {error: 'Invalid Username'});
                }
            } else {
                reply.view('register.ejs', {error: 'Invalid Password'});          
            }
        } else {
            reply.view('register.ejs', {error: 'Invalid Email'});
        }

    }
}
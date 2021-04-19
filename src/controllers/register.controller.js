const db = require('../database/db');
const bcrypt = require('bcrypt');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.is_auth) // L'utente autenticato non ha bisogno di autenticarsi di nuovo
            reply.redirect('/');
        else if (pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER)) { // Controlla se il gruppo Anonymous ha il permesso di registrarsi
            request.view_params.can_register = true;
            reply.view('register.ejs', request.view_params);
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
        if(!pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER)) {
            reply.redirect('/');
            return;
        }

        const view_params = request.view_params;
        view_params.can_register = true;

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
                            view_params.ERROR = 'An error has occured, retry later';
                            reply.view('register.ejs', view_params);
                        } else {
                    
                            const UserModel = db.getUserModel();
        
                            UserModel.create({username: data.username, password: hash, email: data.email, global_group: pex.GLOBAL_USER}).then((value) => {
                                request.session.set('username', data.username);
                                reply.redirect('/');
                            }, (err) => {
                                console.log(err);
                                view_params.ERROR = 'An error has occured, retry later';
                                reply.view('register.ejs', view_params);
                            });
                        }
                    });

                } else {
                    view_params.ERROR = 'Invalid Username';
                    reply.view('register.ejs', view_params);
                }
            } else {
                view_params.ERROR = 'Invalid Password';
                reply.view('register.ejs', view_params);       
            }
        } else {
            view_params.ERROR = 'Invalid Email';
            reply.view('register.ejs', view_params);
        }

    }
}
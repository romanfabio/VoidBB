const db = require('../database/db');
const bcrypt = require('bcrypt');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.is_auth) // L'utente autenticato non ha bisogno di autenticarsi di nuovo
            reply.redirect('/');
        else {
            if(pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER)) {
                request.view_params.can_register = true;
                reply.view('login.ejs', request.view_params);
            }
            else
                reply.view('login.ejs');
        }
    },

    post: (request, reply) => {

        // L'utente autenticato non ha bisogno di autenticarsi di nuovo
        if(request.is_auth) {
            reply.redirect('/');
            return;
        }

        const view_params = request.view_params;

        if(pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER))
            view_params.can_register = true;

        const data = request.body;

        // Rimuovi eventuali spazi 'bianchi'
        data.username = data.username.trim();
        data.password = data.password.trim();

        const UserModel = db.getUserModel();

        UserModel.findByPk(data.username, {attributes: ['password']})
            .then((user) => {
                if(user === null) {
                    view_params.ERROR = 'Username and/or password invalid';
                    reply.view('login.ejs', view_params);
                } else {

                    bcrypt.compare(data.password, user.password, (err, result) => {
                        if(err) {
                            console.log(err);
                            view_params.ERROR = 'An error has occured, retry later';
                            reply.view('login.ejs', view_params);
                        } else {
                            if(result) {
                                request.session.set('username', data.username);

                                if(data.back)
                                    reply.redirect(data.back);
                                else
                                    reply.redirect('/');
                            } else {
                                view_params.ERROR = 'Username and/or password invalid';
                                reply.view('login.ejs', view_params);
                            }
                        }
                    });
                }
            }, (err) => {
                console.log(err);
                view_params.ERROR = 'An error has occured, retry later';
                reply.view('login.ejs', view_params);
            });
        
    }
}
const db = require('../database/db');
const bcrypt = require('bcrypt');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.is_auth) // L'utente autenticato non ha bisogno di autenticarsi di nuovo
            reply.redirect('/');
        else {
            if(pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER))
                reply.view('login.ejs', {can_register: true});
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

        const viewParams = {};

        if(pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER))
            viewParams.can_register = true;

        const data = request.body;

        // Rimuovi eventuali spazi 'bianchi'
        data.username = data.username.trim();
        data.password = data.password.trim();

        const UserModel = db.getUserModel();

        UserModel.findByPk(data.username, {attributes: ['password']})
            .then((user) => {
                if(user === null) {
                    viewParams.ERROR = 'Username and/or password invalid';
                    reply.view('login.ejs', viewParams);
                } else {

                    bcrypt.compare(data.password, user.password, (err, result) => {
                        if(err) {
                            console.log(err);
                            viewParams.ERROR = 'An error has occured, retry later';
                            reply.view('login.ejs', viewParams);
                        } else {
                            if(result) {
                                request.session.set('username', data.username);

                                if(data.back)
                                    reply.redirect(data.back);
                                else
                                    reply.redirect('/');
                            } else {
                                viewParams.ERROR = 'Username and/or password invalid';
                                reply.view('login.ejs', viewParams);
                            }
                        }
                    });
                }
            }, (err) => {
                console.log(err);
                viewParams.ERROR = 'An error has occured, retry later';
                reply.view('login.ejs', viewParams);
            });
        
    }
}
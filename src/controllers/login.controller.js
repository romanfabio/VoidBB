const db = require('../database/db');
const bcrypt = require('bcrypt');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.is_auth) // User is already authenticated
            reply.redirect('/');
        else {
            if(pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER)) // Check if user has permission to register
                request.view_params.can_register = true;
            
            reply.view('login.ejs', request.view_params);
        }
    },

    post: async (request, reply) => {

        // User is already authenticated
        if(request.is_auth) {
            reply.redirect('/');
            return;
        }

        const view_params = request.view_params;

        // Check if user has permission to register
        if(pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER))
            view_params.can_register = true;

        const data = request.body;

        // Remove blank spaces
        data.username = data.username.trim();
        data.password = data.password.trim();

        const UserModel = db.getUserModel();

        try {
            const user = await UserModel.findByPk(data.username, {attributes: ['password']});

            if(user !== null) {

                // Check password
                bcrypt.compare(data.password, user.password, (err, match) => {
                    if(err) {
                        console.log(err);
                        view_params.ERROR = 'An error has occured, retry later';
                        reply.view('login.ejs', view_params);
                    } else {
                        if(match) {
                            request.session.set('username', data.username);

                            // If user was redirected here from another page, redirect him to the previous page
                            if(data.back)
                                reply.redirect(data.back);
                            else
                                reply.redirect('/');
                            
                        } else { // Passwords don't match
                            view_params.ERROR = 'Username and/or password invalid';
                            reply.view('login.ejs', view_params);
                        }
                    }
                });

            } else { // Username doesn't exist
                view_params.ERROR = 'Username and/or password invalid';
                reply.view('login.ejs', view_params);
            }

        } catch(err) {
            console.log(err);
            view_params.ERROR = 'An error has occured, retry later';
            reply.view('login.ejs', view_params);
        }
        
    }
};
const db = require('../database/db');
const bcrypt = require('bcrypt');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.user.username) // User is already authenticated
            reply.redirect('/');
        else 
            reply.view('login.ejs', request.view_args);

    },

    post: async (request, reply) => {

        // User is already authenticated
        if(request.user.username) {
            reply.redirect('/');
            return;
        }

        const view_args = request.view_args;

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
                        view_args.ERROR = 'An error has occured, retry later';
                        reply.view('login.ejs', view_args);
                    } else {
                        if(match) {
                            request.session.set('username', data.username);

                            // If user was redirected here from another page, redirect him to the previous page
                            if(data.back)
                                reply.redirect(data.back);
                            else
                                reply.redirect('/');
                            
                        } else { // Passwords don't match
                            view_args.ERROR = 'Username and/or password invalid';
                            reply.view('login.ejs', view_args);
                        }
                    }
                });

            } else { // Username doesn't exist
                view_args.ERROR = 'Username and/or password invalid';
                reply.view('login.ejs', view_args);
            }

        } catch(err) {
            console.log(err);
            view_args.ERROR = 'An error has occured, retry later';
            reply.view('login.ejs', view_args);
        }
        
    }
};
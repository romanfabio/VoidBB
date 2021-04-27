const db = require('../database/db');
const bcrypt = require('bcrypt');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        // User is already authenticated or doesn't have the permission to register
        if(request.user.username || !pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER))
            reply.redirect('/');
        else
            reply.view('register.ejs', request.view_args);
    },

    post: (request, reply) => {

        // User is already authenticated or doesn't have the permission to register
        if(request.user.username || !pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER)) {
            reply.redirect('/');
            return;
        }

        const view_args = request.view_args;

        const data = request.body;
        
        data.email = data.email.trim();
        if(validator.isEmail(data.email)) {

            data.password = data.password.trim();
            if(validator.isPassword(data.password)) {

                data.username = data.username.trim();
                if(validator.isUsername(data.username)) {

                    bcrypt.hash(data.password, 10, async (err, hash) => {
                        if(err) {
                            console.log(err);
                            view_args.ERROR = 'An error has occured, retry later';
                            reply.view('register.ejs', view_args);
                        } else {
                    
                            const UserModel = db.getUserModel();

                            try {

                                await UserModel.create({username: data.username, password: hash, email: data.email, global_group: pex.GLOBAL_USER});

                                request.session.set('username', data.username);
                                request.flash('info', 'Registration completed');
                                reply.redirect('/');

                            } catch(err) {
                                console.log(err);
                                view_args.ERROR = 'An error has occured, retry later';
                                reply.view('register.ejs', view_args);
                            }
                        }
                    });

                } else {
                    view_args.ERROR = 'Invalid Username';
                    reply.view('register.ejs', view_args);
                }
            } else {
                view_args.ERROR = 'Invalid Password';
                reply.view('register.ejs', view_args);    
            }
        } else {
            view_args.ERROR = 'Invalid Email';
            reply.view('register.ejs', view_args);
        }

        

    }
}
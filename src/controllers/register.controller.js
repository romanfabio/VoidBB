const bcrypt = require('bcrypt');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');

module.exports = {
    get: function (request, reply) {
        console.log(request.user);
        // User is already authenticated or doesn't have the permission to register
        if(request.user.username || !pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER))
            reply.redirect('/');
        else
            reply.view('register.ejs', request.viewArgs);
    },

    post: async function (request, reply) {

        // User is already authenticated or doesn't have the permission to register
        if(request.user.username || !pex.isGlobalSet(pex.GLOBAL_ANONYMOUS, pex.globalBit.REGISTER)) {
            reply.redirect('/');
            return;
        }

        const viewArgs = request.viewArgs;

        const data = request.body;
        
        data.email = data.email.trim();
        if(validator.isEmail(data.email)) {

            data.password = data.password.trim();
            if(validator.isPassword(data.password)) {

                data.username = data.username.trim();
                if(validator.isUsername(data.username)) {

                    try {
                        const hash = await bcrypt.hash(data.password, 10);

                        await this.database.insertUser(data.username, hash, data.email, pex.GLOBAL_USER);

                        request.session.set('user', data.username);
                        request.flash('info', 'Registration completed');
                        reply.redirect('/');
                    } catch(e) {
                        console.error(e);
                        viewArgs.ERROR = 'An error has occured, retry later';
                        reply.view('register.ejs', viewArgs);
                    }

                } else {
                    viewArgs.ERROR = 'Invalid Username';
                    reply.view('register.ejs', viewArgs);
                }
            } else {
                viewArgs.ERROR = 'Invalid Password';
                reply.view('register.ejs', viewArgs);    
            }
        } else {
            viewArgs.ERROR = 'Invalid Email';
            reply.view('register.ejs', viewArgs);
        }
    }
}
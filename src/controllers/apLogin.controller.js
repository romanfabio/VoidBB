const bcrypt = require('bcrypt');
const pex = require('../util/permissionManager');

module.exports = {
    get: async function (request, reply) {
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) // Only admins have access to the admin panel
            reply.redirect('/');
        else {
            if(request.user.ap) {
                reply.redirect('/ap/general');
            } else {
                request.viewArgs.TOKEN = await reply.generateCsrf();
                reply.view('apLogin.ejs', request.viewArgs);
            }
        }

    },

    post: async function (request, reply) {

        // Only admins have access to the admin panel
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
            return;
        }

        if(request.user.ap) {
            reply.redirect('/ap/general');
            return;
        }

        const data = request.body;

        // Remove blank spaces
        data.password = data.password.trim();

        try {
            const user = await this.database.select('password').from('Users').where('username', request.user.username);

            if(user.length === 1) {

                // Check password
                const match = await bcrypt.compare(data.password, user[0].password);

                if(match) {
                    request.session.set('ap', true);

                    reply.redirect('/ap/general');
                } else { // Passwords don't match
                    request.flash('error', 'Password invalid');
                    reply.redirect('/ap');
                }

            } else { // Username doesn't exist
                reply.redirect('/');
            }

        } catch(e) {
            console.error(e);
            request.flash('error', 'An error has occured, retry later');
            reply.redirect('/ap');
        }
        
    },

    logout: async function(request,reply) {
        if(request.user.ap)
            request.session.set('ap', false);
        
        reply.redirect('/');
    }
};
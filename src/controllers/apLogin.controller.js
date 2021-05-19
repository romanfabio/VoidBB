const bcrypt = require('bcrypt');
const pex = require('../util/permissionManager');

module.exports = {
    get: function (request, reply) {
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) // Only admins have access to the admin panel
            reply.redirect('/');
        else {
            const ap = request.session.get('ap');

            if(ap) {
                reply.redirect('/ap/general');
            } else {
                reply.view('apLogin.ejs', request.viewArgs);
            }
        }

    },

    post: async function (request, reply) {

        // User is already authenticated
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
            return;
        }

        const ap = request.session.get('ap');

        if(ap) {
            reply.redirect('/ap/general');
            return;
        }

        const viewArgs = request.viewArgs;

        const data = request.body;

        // Remove blank spaces
        data.password = data.password.trim();

        try {
            const user = await this.database.find_Password_Of_Users_By_Username(request.user.username);

            if(user !== null) {

                // Check password
                const match = await bcrypt.compare(data.password, user.password);

                if(match) {
                    request.session.set('ap', true);

                    // If user was redirected here from another page, redirect him to the previous page
                    reply.redirect('/ap/general');
                } else { // Passwords don't match
                    viewArgs.ERROR = 'Password invalid';
                    reply.view('apLogin.ejs', viewArgs);
                }

            } else { // Username doesn't exist
                reply.redirect('/');
            }

        } catch(e) {
            console.error(e);
            viewArgs.ERROR = 'An error has occured, retry later';
            reply.view('apLogin.ejs', viewArgs);
        }
        
    },

    logout: async function(request,reply) {
        if(request.user.username)
            request.session.set('ap', false);
        
        reply.redirect('/');
    }
};
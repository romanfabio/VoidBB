const bcrypt = require('bcrypt');

module.exports = {
    get: function (request, reply) {
        if(request.user.username) // User is already authenticated
            reply.redirect('/');
        else 
            reply.view('login.ejs', request.viewArgs);

    },

    post: async function (request, reply) {

        // User is already authenticated
        if(request.user.username) {
            reply.redirect('/');
            return;
        }

        const viewArgs = request.viewArgs;

        const data = request.body;

        // Remove blank spaces
        data.username = data.username.trim();
        data.password = data.password.trim();

        try {
            const user = await this.database.find_Password_Of_Users_By_Username(data.username);

            if(user !== null) {

                // Check password
                const match = await bcrypt.compare(data.password, user.password);

                if(match) {
                    request.session.set('user', data.username);

                    // If user was redirected here from another page, redirect him to the previous page
                    if(data.back)
                        reply.redirect(data.back);
                    else
                        reply.redirect('/');
                } else { // Passwords don't match
                    viewArgs.ERROR = 'Username and/or password invalid';
                    reply.view('login.ejs', viewArgs);
                }

            } else { // Username doesn't exist
                viewArgs.ERROR = 'Username and/or password invalid';
                reply.view('login.ejs', viewArgs);
            }

        } catch(e) {
            console.error(e);
            viewArgs.ERROR = 'An error has occured, retry later';
            reply.view('login.ejs', viewArgs);
        }
        
    }
};
const pex = require('../util/permissionManager');

module.exports = {

    get: async function(request, reply) {
        const username = request.params.username;

        if(username.length > 0) { // if url ends with /u/ , username is an invalid empty string, so redirect user to home

            const viewArgs = request.viewArgs;

            if(!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_USER)) {

                viewArgs.back = '/u/' + username;
                viewArgs.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewArgs);
                return;
            }

            try {

                let result = await this.database.select('email').from('Users').where('username', username);

                if(result.length === 1) {
                    viewArgs.user = {username: username, email: result[0].email};
                    reply.view('viewUser.ejs', viewArgs);
                } else {
                    //User doesn't exists, redirect to home
                    reply.redirect('/');
                }
            } catch(e) {
                console.error(e);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }
    }
}
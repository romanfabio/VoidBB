const pex = require('../util/permissionManager');

module.exports = {

    get: async function(request, reply) {
        const username = request.params.username;

        if(username.length > 0) {

            const viewArgs = request.viewArgs;

            if(!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_USER)) {

                viewArgs.back = '/u/' + username;
                viewArgs.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewArgs);
                return;

            }

            try {
                const user = await this.database.find_Email_Of_User_By_Username(username);

                if(user !== null) {
                    viewArgs.user = {username: username, email: user.email};
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
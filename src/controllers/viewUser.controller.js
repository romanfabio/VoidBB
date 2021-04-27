const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {

    get: async (request, reply) => {
        const username = request.params.username;

        if(username.length > 0) {

            const view_args = request.view_args;

            if(!pex.isGlobalSet(request.user.global_group, pex.globalBit.VIEW_USER)) {

                view_args.back = '/u/' + username;
                view_args.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', view_args);
                return;

            }

            const UserModel = db.getUserModel();

            try {
                const user = await UserModel.findByPk(username, {attributes: ['username', 'email']});

                if(user !== null) {
                    view_args.user = {username: user.username, email: user.email};
                    reply.view('viewUser.ejs', view_args);
                } else {
                    reply.redirect('/');
                }
            } catch(err) {
                console.log(err);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }
    }
}
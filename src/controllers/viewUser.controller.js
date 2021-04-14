const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {

    get: (request, reply) => {
        const username = request.params.username;

        if(username.length > 0) {

            const viewParams = {};

            if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER)) {
                viewParams.can_register = true;
            }

            if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.VIEW_USER)) {

                viewParams.back = '/u/' + username;
                viewParams.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewParams);
                return;

            }

            const UserModel = db.getUserModel();

            UserModel.findByPk(username, {attributes: ['username', 'email']}).then((user) => {
                if(user === null) {
                    // User doesn't exists, redirect to home
                    reply.redirect('/');
                } else {
                    viewParams.user = {username: user.username, email: user.email};

                    if(request.is_auth) {
                        viewParams.USERNAME = request.is_auth;
                    }

                    reply.view('viewUser.ejs', viewParams);
                }
            }, (err) => {
                console.log(err);
                reply.redirect('/');
            });

        } else {
            reply.redirect('/');
        }
    }
}
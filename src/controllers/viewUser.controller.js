const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {

    get: async (request, reply) => {
        const username = request.params.username;

        if(username.length > 0) {

            const view_params = request.view_params;

            if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER)) {
                view_params.can_register = true;
            }

            if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.VIEW_USER)) {

                view_params.back = '/u/' + username;
                view_params.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', view_params);
                return;

            }

            const UserModel = db.getUserModel();

            try {
                const user = await UserModel.findByPk(username, {attributes: ['username', 'email']});

                if(user !== null) {
                    view_params.user = {username: user.username, email: user.email};
                    reply.view('viewUser.ejs', view_params);
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
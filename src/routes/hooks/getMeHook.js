const pex = require('../../util/permissionManager');
const db = require('../../database/db');
const cache = require('../../util/cache');

/*
    Always
        - request.view_params : object = <parameters to be passed to the view>
    Authenticated User
        - request.is_auth : string = <user's username>
        - request.user_global_group : number = <user's global group id>
    Non-Authenticated User
        - request.user_global_group : number = <Anonymous global group id>
*/
module.exports = async (request, reply) => {
    console.log('GetMe Hook');

    request.view_params = {};

    const username = request.session.get('username');

    if (!username) {
        request.user_global_group = pex.GLOBAL_ANONYMOUS;
        return;
    }

    const msgs = reply.flash();

    if (msgs) {
        if (msgs.info)
            request.view_params.INFO = msgs.info[0];
        if (msgs.error)
            request.view_params.ERROR = msgs.error[0];
    }

    const cached = cache.global_group(username);

    let global_group;

    if (cached) {
        global_group = cached;
    } else {
        const UserModel = db.getUserModel();

        try {
            const user = await UserModel.findByPk(username, { attributes: ['global_group'] });

            if (user === null) {
                request.user_global_group = pex.GLOBAL_ANONYMOUS;
                request.session.delete();

                return;
            } else {
                global_group = user.global_group;

                cache.invalidate_global_group(username, user.global_group);
            }
        } catch (err) {
            console.log(err);
            request.user_global_group = pex.GLOBAL_ANONYMOUS;

            return;
        }

    }

    request.is_auth = username
    request.view_params.USERNAME = username;
    request.user_global_group = global_group;

    if (global_group === pex.GLOBAL_ADMIN)
        request.view_params.AP = true;

};

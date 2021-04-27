const pex = require('../../util/permissionManager');
const db = require('../../database/db');
const cache = require('../../util/cache');

/*
    Require
        - isAuth Hook
        - view Hook
    Always
        - request.user.global_group : number = <user's global group id>
    Admin
        - request.view_args.AP = true
*/
module.exports = async (request, reply) => {
    console.log('Global Hook');

    if (!request.user.username) {
        request.user.global_group = pex.GLOBAL_ANONYMOUS;
    } else {
        const username = request.user.username;

        const cached = cache.global_group(username);
        if (cached) {
            request.user.global_group = cached;
        } else {

            const UserModel = db.getUserModel();

            try {
                const user = await UserModel.findByPk(username, { attributes: ['global_group'] });

                if (user !== null) {
                    request.user.global_group = user.global_group;
                    cache.invalidate_global_group(username, user.global_group);
                } else {
                    request.user.global_group = pex.GLOBAL_ANONYMOUS;
                    request.session.delete();
                }
            } catch (err) {
                console.log(err);
                request.user.global_group = pex.GLOBAL_ANONYMOUS;
            }

        }
    }

    if (request.user.global_group === pex.GLOBAL_ADMIN)
        request.view_args.AP = true;
    if (pex.isGlobalSet(request.user.global_group, pex.globalBit.REGISTER))
        request.view_args.CAN_REGISTER = true;

};

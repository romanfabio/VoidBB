const pex = require('../../util/permissionManager');
const cache = require('../../util/cache');

/*
    Require
        - isAuth Hook
        - view Hook
    Always
        - request.user.globalGroup : number = <user's global group id>
    Admin
        - request.viewArgs.CAN_AP = true
    Admin already logged in Admin Panel
        - request.viewArgs.AP = true
        - request.user.ap = true
*/
module.exports = async function (request, reply) {
    console.info('global Hook');

    if (!request.user.username) {
        request.user.globalGroup = pex.GLOBAL_ANONYMOUS;
    } else {

        try {
            const group = await cache.gGroup(request.user.username);
            if(group) 
                request.user.globalGroup = group;
            else {
                request.user.globalGroup = pex.GLOBAL_ANONYMOUS;
                request.session.delete();
            }

            if (request.user.globalGroup === pex.GLOBAL_ADMIN) {

                const ap = request.session.get('ap');

                if (ap) {
                    if (!request.url.startsWith('/ap/')) {
                        request.session.set('ap', undefined);
                        request.viewArgs.CAN_AP = true;
                    } else {
                        request.viewArgs.AP = true;
                        request.user.ap = true;
                    }
                }
                else
                    request.viewArgs.CAN_AP = true;
            }
        } catch (e) {
            console.error(e);
            request.user.globalGroup = pex.GLOBAL_ANONYMOUS;
        }
    }

    if (pex.isGlobalSet(request.user.globalGroup, pex.globalBit.REGISTER))
        request.viewArgs.CAN_REGISTER = true;

};

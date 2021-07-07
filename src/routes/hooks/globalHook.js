const pex = require('../../util/permissionManager');

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
    console.log('global Hook');

    if (!request.user.username) {
        request.user.globalGroup = pex.GLOBAL_ANONYMOUS;
    } else {

        try {
            const group = await this.database.select('globalGroup').from('Users').where('username', request.user.username);

            if(group.length === 1)
                request.user.globalGroup = group[0].globalGroup;
            else {
                request.user.globalGroup = pex.GLOBAL_ANONYMOUS;
                request.session.delete();
            }
        } catch(e) {
            console.error(e);
            request.user.globalGroup = pex.GLOBAL_ANONYMOUS;
        }
    }

    if (request.user.globalGroup === pex.GLOBAL_ADMIN) {

        const ap = request.session.get('ap');
        console.log(ap);
        if(ap) {
            if(!request.url.startsWith('/ap/')) {
                request.session.set('ap', false);
                request.viewArgs.CAN_AP = true;
            } else {
                request.viewArgs.AP = true;
                request.user.ap = true;
            }
        }
        else
            request.viewArgs.CAN_AP = true;
    }

    if (pex.isGlobalSet(request.user.globalGroup, pex.globalBit.REGISTER))
        request.viewArgs.CAN_REGISTER = true;

};

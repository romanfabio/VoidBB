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
*/
module.exports = async function (request, reply) {
    console.log('Global Hook');

    if (!request.user.username) {
        request.user.globalGroup = pex.GLOBAL_ANONYMOUS;
    } else {

        try {
            const group = await this.database.find_GlobalGroup_Of_Users_By_Username(request.user.username);

            if(group !== null)
                request.user.globalGroup = group.globalGroup;
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
        console.log(request.url);
        const ap = request.session.get('ap');
        if(ap) {
            if(!request.url.startsWith('/ap/')) {
                request.session.set('ap', false);
                request.viewArgs.CAN_AP = true;
            } else
                request.viewArgs.AP = true;
        }
        else
            request.viewArgs.CAN_AP = true;
    }
    if (pex.isGlobalSet(request.user.globalGroup, pex.globalBit.REGISTER))
        request.viewArgs.CAN_REGISTER = true;

};

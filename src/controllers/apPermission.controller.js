const pex = require('../util/permissionManager');
const variable = require('../util/variableManager');

module.exports = {
    get: function(request, reply) {
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
        } else {

            if(request.user.ap) {
                const viewArgs = request.viewArgs;

                const anonymousMask = pex.getGlobalMask(pex.GLOBAL_ANONYMOUS);
                const userMask = pex.getGlobalMask(pex.GLOBAL_USER);
                const moderatorMask = pex.getGlobalMask(pex.GLOBAL_MODERATOR);

                viewArgs.A_REGISTER = (anonymousMask[pex.globalBit.REGISTER] == '1'?'checked':'');
                viewArgs.A_VIEW_FORUM = (anonymousMask[pex.globalBit.VIEW_FORUM] == '1'?'checked':'');
                viewArgs.A_VIEW_USER = (anonymousMask[pex.globalBit.VIEW_USER] == '1'?'checked':'');

                viewArgs.U_CREATE_FORUM = (userMask[pex.globalBit.CREATE_FORUM] == '1'?'checked':'');

                viewArgs.M_CREATE_FORUM = (moderatorMask[pex.globalBit.CREATE_FORUM] == '1'?'checked':'');

                reply.view('apPermission.ejs', viewArgs);
            } else {
                reply.redirect('/ap');
            }

        }
    },

    post: async function (request, reply) {
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
            return;
        }

        if(!request.user.ap) {
            reply.redirect('/ap');
            return;
        }

        const data = request.body;
        
        const anonymousMask = fillAnonymousMask(data);

        const userMask = fillUserMask(data);

        const moderatorMask = fillModeratorMask(data);

        try {

            await this.database.transaction(async trx => {

                await trx('GlobalGroups').where('id', pex.GLOBAL_ANONYMOUS).update({mask: anonymousMask});
                await trx('GlobalGroups').where('id', pex.GLOBAL_USER).update({mask: userMask});
                await trx('GlobalGroups').where('id', pex.GLOBAL_MODERATOR).update({mask: moderatorMask});

                await pex.reload(trx);
            });

            request.flash('info','Settings saved');
            reply.redirect('/ap/pex');

        } catch(e) {
            console.error(e);
            request.flash('error','An error has occured, retry later');
            reply.redirect('/ap/pex');
        }
    }
};

function fillAnonymousMask(data) {
    
    let required = variable.get('REQUIRED_ANONYMOUS');

    if(data.A_REGISTER)
        required = setOn(required, pex.globalBit.REGISTER);
    if(data.A_VIEW_FORUM) 
        required = setOn(required, pex.globalBit.VIEW_FORUM);
    if(data.A_VIEW_USER)
        required = setOn(required, pex.globalBit.VIEW_USER);

    return required;
}

function fillUserMask(data) {

    let required = variable.get('REQUIRED_USER');

    if(data.U_CREATE_FORUM)
        required = setOn(required, pex.globalBit.CREATE_FORUM);

    return required;
}

function fillModeratorMask(data) {

    let required = variable.get('REQUIRED_MODERATOR');

    if(data.M_CREATE_FORUM)
        required = setOn(required, pex.globalBit.CREATE_FORUM);

    return required;
}

function setOn(str,index) {
    return str.substring(0,index) + '1' + str.substring(index+1);
}
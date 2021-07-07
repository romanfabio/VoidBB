const pex = require('../util/permissionManager');
const variable = require('../util/variableManager');

module.exports = {
    get: function(request, reply) {
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
        } else {

            if(request.user.ap) {
                reply.view('apPermission.ejs', request.viewArgs);
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

        console.log(request.body);

        const data = request.body;
        
        const anonymousMask = fillAnonymousMask(data);

        try {

            

        } catch(e) {
            console.error(e);
            request.flash('error','An error has occured, retry later');
            reply.redirect('/ap/pex');
        }
    }
};

function fillAnonymousMask(data) {
    
    let required = variable.get('REQUIRED_ANONYMOUS');

    if(data.REGISTER)
        required[pex.globalBit.REGISTER] = '1';
    if(data.VIEW_FORUM) 
        required[pex.globalBit.VIEW_FORUM] = '1';
    if(data.VIEW_USER)
        required[pex.globalBit.VIEW_USER] = '1';

    return required;
}
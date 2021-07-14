const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const variable = require('../util/variableManager');

module.exports = {
    get: async function (request, reply) {
        //pex.GLOBAL_ANONYMOUS can't have CREATE_FORUM permission
        if(pex.isGlobalSet(request.user.globalGroup, pex.globalBit.CREATE_FORUM)) {
            request.viewArgs.TOKEN = await reply.generateCsrf();
            reply.view('newForum.ejs', request.viewArgs);
        }
        else {
            reply.redirect('/');
        }
    },

    post: async function (request, reply) {

        //pex.GLOBAL_ANONYMOUS can't have CREATE_FORUM permission
        if(!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.CREATE_FORUM)) {
            reply.redirect('/');
            return;
        }

        const data = request.body;

        data.name = data.name.trim();
        data.description = data.description.trim();

        if(validator.isForumName(data.name)) {
            if(validator.isForumDescription(data.description)) {
                //Forums can't contain uppercase letter
                data.name = data.name.toLowerCase();

                try {
                    const required = pex.REQUIRED_FORUM_PEX;

                    await this.database('Forums').insert([{name: data.name, description: data.description, creator: request.user.username, pexMask: required}]);

                    request.flash('info', 'Forum created');
                    reply.redirect('/f/' + data.name);

                } catch(e) {
                    console.error(e);
                    request.flash('error', 'An error has occured, retry later');
                    reply.redirect('/f');
                }
                    
            } else {
                request.flash('error', 'Invalid Description');
                reply.redirect('/f');
            }
        } else {
            request.flash('error', 'Invalid Name');
            reply.redirect('/f');
        }

    }
};
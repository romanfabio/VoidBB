const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const variable = require('../util/variableManager');

module.exports = {
    get: function (request, reply) {
        //pex.GLOBAL_ANONYMOUS can't have CREATE_FORUM permission
        if(pex.isGlobalSet(request.user.globalGroup, pex.globalBit.CREATE_FORUM)) {
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

        // User must be registered, request.user.username is always valid
        const viewArgs = request.viewArgs;


        const data = request.body;

        data.name = data.name.trim();
        data.description = data.description.trim();

        if(validator.isForumName(data.name)) {
            if(validator.isForumDescription(data.description)) {
                //Forums can't contain uppercase letter
                data.name = data.name.toLowerCase();

                try {
                    const emptyMask = variable.get('EMPTY_MASK');

                    await this.database('Forums').insert([{name: data.name, description: data.description, creator: request.user.username, userMask: emptyMask, moderatorMask: emptyMask}]);

                    request.flash('info', 'Forum created');
                    reply.redirect('/f/' + data.name);

                } catch(e) {
                    console.error(e);
                    viewArgs.ERROR = 'An error has occured, retry later';
                    reply.view('newForum.ejs', viewArgs);
                }
                    
            } else {
                viewArgs.ERROR = 'Invalid Description';
                reply.view('newForum.ejs', viewArgs);
            }
        } else {
            viewArgs.ERROR = 'Invalid Name';
            reply.view('newForum.ejs', viewArgs);
        }

    }
};
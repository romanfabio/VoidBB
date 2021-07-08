const pex = require('../util/permissionManager');
const cache = require('../util/cache');

module.exports = {
    get: async function(request, reply) {
        const name = request.params.name;

        if(name.length > 0) { // if url ends with /f/ , name is an invalid empty string, so redirect user to home

            const viewArgs = request.viewArgs;

            if(!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

                viewArgs.back = '/f/' + name;
                viewArgs.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewArgs);
                return;
            }

            try {
                let result = await this.database.select('*').from('Forums').where('name', name);

                if(result.length === 1) {

                    const forum = result[0];

                    result = await this.database.select('*').from('Posts').where('forumName', name);

                    viewArgs.posts = result;

                    viewArgs.forumName = name;

                    if(request.user.username) {

                        if(forum.creator === request.user.username || request.user.globalGroup === pex.GLOBAL_ADMIN) {
                            //Admin has full permission
                            viewArgs.canCreatePost = true;
                            reply.view('viewForum.ejs', viewArgs);
                            return;
                        }

                        // TODO Can global moderator ignore forum's permission?
                        result = await cache.fMod(request.user.username, name);

                        if(result) {
                            if(forum.moderatorMask[pex.forumBit.CREATE_POST] == '1')
                                viewArgs.canCreatePost = true;
                        } else {
                            if(forum.userMask[pex.forumBit.CREATE_POST] == '1')
                                viewArgs.canCreatePost = true;
                        }

                    } else {
                        if(forum.userMask[pex.forumBit.ANONYMOUS_POST] == '1')
                            viewArgs.canCreatePost = true;
                    }

                    reply.view('viewForum.ejs', viewArgs);

                } else {
                    reply.redirect('/');
                }
            } catch(e) {
                console.error(e);
                reply.redirect('/');
            }
        } else {
            reply.redirect('/');
        }

    }
}
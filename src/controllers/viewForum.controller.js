const pex = require('../util/permissionManager');

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
                const forum = await this.database.find_Forum_By_Name(name);

                if(forum !== null) {

                    const posts = await this.database.findAllPosts_By_ForumName(name);

                    viewArgs.forumName = name;
                    viewArgs.posts = posts;
                    viewArgs.styles = ['preview-list.css'];

                    if(request.user.username) {

                        if(forum.creator === request.user.username || request.user.globalGroup === pex.GLOBAL_ADMIN) {
                            //Admin has full permission
                            viewArgs.canCreatePost = true;
                            reply.view('viewForum.ejs', viewArgs);
                            return;
                        }

                        // TODO Can global moderator ignore forum's permission?

                        const mod = await this.database.find_ForumModerators_By_Username_ForumName(request.user.username, name);

                        if(mod !== null) {
                            if(forum.moderatorMask[pex.forumBit.CREATE_POST] == '1')
                                view_args.canCreatePost = true;
                        } else {
                            if(forum.userMask[pex.forumBit.CREATE_POST] == '1')
                                view_args.canCreatePost = true;
                        }

                    } else {
                        if(forum.userMask[pex.forumBit.ANONYMOUS_POST] == '1')
                            view_args.canCreatePost = true;
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
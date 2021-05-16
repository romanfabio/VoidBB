const pex = require('../util/permissionManager');
const validator = require('../util/validator');

module.exports = {
    get: async function(request, reply) {
        const id = request.params.id;

        const viewArgs = request.viewArgs;

        if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

            viewArgs.back = '/p/' + id;
            viewArgs.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', viewArgs);
            return;
        }

        try {
            const post = await this.database.find_Post_By_Id(id);

            if (post !== null) {
                viewArgs.post = post;

                const comments = await this.database.findAllComments_By_PostId(post.id);

                viewArgs.comments = comments;

                const forum = await this.database.find_Creator_UMask_MMask_Of_Forums_By_Name(post.forumName);

                if(forum === null) {
                    // Forum doesn't exists, redirect to home
                    reply.redirect('/');
                    return;
                }

                const canComment = await canComment(request, this.database,forum, post);

                if(canComment === null) {
                    reply.redirect('/');
                    return;
                }


                if(canComment) {
                    viewArgs.canComment = true;
                }

                reply.view('viewPost.ejs', viewArgs);

            } else {
                //Post doesn't exists, redirect to home
                reply.redirect('/');
            }
        } catch (e) {
            console.error(e);
            reply.redirect('/');
        }

    },

    post: async function(request, reply) {
        const id = request.params.id;

        const viewArgs = request.viewArgs;

        if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

            viewArgs.back = '/p/' + id;
            viewArgs.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', viewArgs);
            return;
        }

        const data = request.body;
        data.description = data.description.trim();

        try {

            const post = await this.database.find_Post_By_Id(id);

            if(post !== null) {
                viewArgs.post = post;

                const comments = await this.database.findAllComments_By_PostId(post.id);

                viewArgs.comments = comments;

                const forum = await this.database.find_Creator_UMask_MMask_Of_Forums_By_Name(post.forumName);

                if(forum === null) {
                    //Forum doesn't exists, redirect to home
                    reply.redirect('/');
                    return;
                }

                const canComment = await canComment(request, this.database,forum, post);

                if(canComment === null) {
                    reply.redirect('/');
                    return;
                }

                if(canComment) {
                    view_args.canComment = true;
                } else {
                    reply.view('viewPost.ejs', viewArgs);
                    return;
                }

                if(validator.isComment(data.description)) {

                    try {

                        await this.database.insertComment(id,null,data.description, (request.user.username?request.user.username:null));
                        
                        reply.redirect('/p/' + id);
                    } catch(e) {
                        console.error(e);
                        viewArgs.ERROR = 'An error has occured, retry later';
                        reply.view('viewPost.ejs', viewArgs);
                    }
                } else {
                    viewArgs.ERROR = 'Invalid comment';
                    reply.view('viewPost.ejs', viewArgs);
                }

            } else {
                //Post doesn't exists, redirect to home
                reply.redirect('/');
            }
        } catch(e) {
            console.error(e);
            reply.redirect('/');
        }
    }
};

/**
 * @returns true if user has permission to comment, otherwise return false. Return null if a database's error occurs.
 */
async function canComment(request, database, forum, post) {

    let result = false;

    if(request.user.username) {

        if(request.user.username === forum.creator || request.user.globalGoup === pex.GLOBAL_ADMIN) {
            result = true;
        } else {
            try {
                // TODO Can global moderator ignore forum's permission?
                const mod = await database.find_ForumModerators_By_Username_ForumName(request.user.username, post.forumName);

                if (mod !== null) {
                    if (forum.moderatorMask[pex.forumBit.CREATE_COMMENT] == '1')
                        result = true;
                } else {
                    if (forum.userMask[pex.forumBit.CREATE_COMMENT] == '1')
                        result = true;
                }
            } catch(e) {
                console.error(e);
                result = null;
            }
        }
    } else {
        if (forum.userMask[pex.forumBit.ANONYMOUS_COMMENT] == '1')
            result = true;
    }

    return result;
}
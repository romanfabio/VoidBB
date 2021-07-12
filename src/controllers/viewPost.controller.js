const pex = require('../util/permissionManager');
const validator = require('../util/validator');
const cache = require('../util/cache');

module.exports = {
    get: async function (request, reply) {
        const id = request.params.id;

        const viewArgs = request.viewArgs;

        if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

            viewArgs.back = '/p/' + id;
            viewArgs.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', viewArgs);
            return;
        }

        try {
            let result = await this.database.select('*').from('Posts').where('id', id);

            if (result.length === 1) {
                const post = result[0];

                viewArgs.post = post;

                result = await this.database.select('creator', 'pexMask').from('Forums').where('name', post.forumName);

                if (result.length !== 1) {
                    // Forum doesn't exists, redirect to home
                    reply.redirect('/');
                    return;
                }


                const forum = result[0];

                const canComment = await hasPexToComment(request, this.database, forum, post);

                if (canComment === null) {
                    // An error has occured while checking for permission to comment
                    reply.redirect('/');
                    return;
                }


                if (canComment) {
                    viewArgs.canComment = true;
                }

                result = await this.database.select('*').from('Comments').where('postId', id);

                viewArgs.comments = result;

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

    post: async function (request, reply) {
        const id = request.params.id;

        const viewArgs = request.viewArgs;

        // TODO Post method are aonly allowed to redirect, no render views
        if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

            viewArgs.back = '/p/' + id;
            viewArgs.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', viewArgs);
            return;
        }

        const data = request.body;
        data.description = data.description.trim();

        try {

            let result = await this.database.select('*').from('Posts').where('id', id);

            if (result.length === 1) {

                const post = result[0];

                result = await this.database.select('creator', 'pexMask').from('Forums').where('name', post.forumName);

                if (result.length !== 1) {
                    //Forum doesn't exists, redirect to home
                    reply.redirect('/');
                    return;
                }

                const forum = result[0];

                const canComment = await hasPexToComment(request, this.database, forum, post);

                if (canComment === null) {
                    reply.redirect('/');
                    return;
                }

                if (!canComment) {
                    reply.redirect('/p/' + id);
                    return;
                }

                if (validator.isComment(data.description)) {

                    try {
                        await this.database('Comments').insert([{ postId: id, reply: null, description: data.description, creator: (request.user.username ? request.user.username : null) }]);

                        reply.redirect('/p/' + id);
                    } catch (e) {
                        console.error(e);
                        request.flash('error', 'An error has occured, retry later');
                        reply.redirect('/p/' + id);
                    }
                } else {
                    request.flash('error', 'Invalid Comment');
                    reply.redirect('/p/' + id);
                }

            } else {
                //Post doesn't exists, redirect to home
                reply.redirect('/');
            }
        } catch (e) {
            console.error(e);
            reply.redirect('/');
        }
    }
};

/**
 * @returns true if user has permission to comment, otherwise return false. Return null if a database's error occurs.
 */
async function hasPexToComment(request, database, forum, post) {

    let result = false;

    if (request.user.username) {

        if (request.user.username === forum.creator || request.user.globalGroup === pex.GLOBAL_ADMIN) {
            result = true;
        } else {
            try {
                // TODO Can global moderator ignore forum's permission?
                const mod = await cache.fMod(request.user.username, post.forumName);

                if (mod) {
                    if (forum.pexMask[pex.forumBit.M_CRT_COMMENT] == '1')
                        result = true;
                } else {
                    if (forum.pexMask[pex.forumBit.U_CRT_COMMENT] == '1')
                        result = true;
                }
            } catch (e) {
                console.error(e);
                result = null;
            }
        }
    } else {
        if (forum.pexMask[pex.forumBit.A_CRT_COMMENT] == '1')
            result = true;
    }

    return result;
}
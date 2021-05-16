const validator = require('../util/validator');
const pex = require('../util/permissionManager');

module.exports = {
    get: async function (request, reply) {

        const name = request.query.f;

        if (name.length > 0) { // if param is like /p?f= , f is an invalid empty string, so redirect user to home

            const viewArgs = request.viewArgs;

            if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

                viewArgs.back = '/f/' + name;
                viewArgs.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewArgs);
                return;
            }

            try {

                const forum = await this.database.find_Creator_UMask_MMask_Of_Forums_By_Name(name);

                if (forum !== null) {

                    viewArgs.forumName = name;

                    if (request.user.username) {

                        const username = request.user.username;

                        // Board admin and forum admin have full permission
                        if (forum.creator === username || request.user.globalGroup === pex.GLOBAL_ADMIN) {
                            reply.view('newPost.ejs', viewArgs);
                            return;
                        }

                        // TODO Can global moderator ignore forum's permission?

                        const moderator = await this.database.find_ForumModerators_By_Username_ForumName(username, name);

                        if (moderator === null) {
                            // Normal user
                            if (forum.userMask[pex.forumBit.CREATE_POST] == '1')
                                reply.view('newPost.ejs', viewArgs);
                            else
                                reply.redirect('/f/' + name);
                        } else {
                            // Moderator of this forum
                            if (forum.moderatorMask[pex.forumBit.CREATE_POST] == '1')
                                reply.view('newPost.ejs', viewArgs);
                            else
                                reply.redirect('/f/' + name);
                        }

                    } else {
                        // Anonymous
                        if (forum.userMask[pex.forumBit.ANONYMOUS_POST] == '1')
                            reply.view('newPost.ejs', viewArgs);
                        else
                            reply.redirect('/f/' + name);
                    }

                } else {
                    // Forum doesn't exists, redirect to home
                    reply.redirect('/');
                }
            } catch (e) {
                console.error(e);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }

    },

    post: async function(request, reply) {
        const name = request.query.f;

        if (name.length > 0) { // if param is like /p?f= , f is an invalid empty string, so redirect user to home

            const viewArgs = request.viewArgs;

            if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

                viewArgs.back = '/f/' + name;
                viewArgs.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewArgs);
                return;
            }

            try {
                const forum = await this.database.find_Creator_UMask_MMask_Of_Forums_By_Name(name);

                if (forum !== null) {

                    viewArgs.forumName = name;

                    const data = request.body;

                    data.title = data.title.trim();
                    if (validator.isPostTitle(data.title)) {
                        data.description = data.description.trim();

                        if (validator.isPostDescription(data.description)) {

                            let creator = null;

                            if (request.user.username) {

                                const username = request.user.username;

                                creator = username;

                                // TODO Can global moderator ignore forum's permission?

                                // Is not administrator of this forum or the board's admin
                                if (forum.creator !== username && request.user.globalGroup !== pex.GLOBAL_ADMIN) {
                                    const moderator = await this.database.find_ForumModerators_By_Username_ForumName(username, name);

                                    if(moderator === null) {
                                        // Normal user
                                        if (forum.userMask[pex.forumBit.CREATE_POST] != '1') {
                                            reply.redirect('/f/' + name);
                                            return;
                                        }

                                    } else {
                                        // Moderator of this forum
                                        if (forum.moderatorMask[pex.forumBit.CREATE_POST] != '1') {
                                            reply.redirect('/f/' + name);
                                            return;
                                        }

                                    }
                                }
                            } else {
                                if (forum.userMask[pex.forumBit.ANONYMOUS_POST] == '1') {
                                    creator = null;
                                }
                                else {
                                    reply.redirect('/f/' + name);
                                    return;
                                }
                            }

                            await this.database.insertPost(name, data.title, data.description, creator);

                            request.flash('info', 'Post created');
                            reply.redirect('/f/' + name);

                        } else {
                            viewArgs.ERROR = 'Invalid description';
                            reply.view('newPost.ejs', viewArgs);
                        }
                    } else {
                        viewArgs.ERROR = 'Invalid title';
                        reply.view('newPost.ejs', viewArgs);
                    }
                } else {
                    // Forum doesn't exists, redirect to home
                    reply.redirect('/');
                }
            } catch (e) {
                console.error(e);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }
    }
};
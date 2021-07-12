const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const cache = require('../util/cache');

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

                let result = await this.database.select('creator','pexMask').from('Forums').where('name', name);

                if (result.length === 1) {
                    const forum = result[0];

                    viewArgs.forumName = name;

                    if (request.user.username) {

                        const username = request.user.username;

                        // Board admin and forum admin have full permission
                        if (forum.creator === username || request.user.globalGroup === pex.GLOBAL_ADMIN) {
                            reply.view('newPost.ejs', viewArgs);
                            return;
                        }

                        // TODO Can global moderator ignore forum's permission?
                        result = await cache.fMod(username, name);

                        if (!result) {
                            // Normal user
                            if (forum.pexMask[pex.forumBit.U_CRT_POST] == '1')
                                reply.view('newPost.ejs', viewArgs);
                            else
                                reply.redirect('/f/' + name);
                        } else {
                            // Moderator of this forum
                            if (forum.pexMask[pex.forumBit.M_CRT_POST] == '1')
                                reply.view('newPost.ejs', viewArgs);
                            else
                                reply.redirect('/f/' + name);
                        }

                    } else {
                        // Anonymous
                        if (forum.pexMask[pex.forumBit.A_CRT_POST] == '1')
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

            // TODO Post method are aonly allowed to redirect, no render views
            if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {

                viewArgs.back = '/f/' + name;
                viewArgs.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewArgs);
                return;
            }

            try {
                let result = await this.database.select('creator','pexMask').from('Forums').where('name', name);

                if (result.length === 1) {
                    const forum = result[0];

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
                                    
                                    result = await cache.fMod(username, name);
                                    
                                    if(!result) {
                                        // Normal user
                                        if (forum.pexMask[pex.forumBit.U_CRT_POST] != '1') {
                                            reply.redirect('/f/' + name);
                                            return;
                                        }

                                    } else {
                                        // Moderator of this forum
                                        if (forum.pexMask[pex.forumBit.M_CRT_POST] != '1') {
                                            reply.redirect('/f/' + name);
                                            return;
                                        }

                                    }
                                }
                            } else {
                                if (forum.pexMask[pex.forumBit.A_CRT_POST] == '1') {
                                    creator = null;
                                }
                                else {
                                    reply.redirect('/f/' + name);
                                    return;
                                }
                            }

                            
                            await this.database('Posts').insert([{forumName: name, title: data.title, description: data.description, creator: creator}]);

                            request.flash('info', 'Post created');
                            reply.redirect('/f/' + name);

                        } else {
                            request.flash('error', 'Invalid Description');
                            reply.redirect('/f/' + name);
                        }
                    } else {
                        request.flash('error', 'Invalid Title');
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
    }
};
const db = require('../database/db');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const { UniqueConstraintError } = require('sequelize');

module.exports = {
    get: async (request, reply) => {

        const name = request.query.f;

        if (name.length > 0) { // if param is like /p?f= , f is an invalid empty string, so redirect user to home

            const view_args = request.view_args;

            if (!pex.isGlobalSet(request.user.global_group, pex.globalBit.VIEW_FORUM)) {

                view_args.back = '/f/' + name;
                view_args.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', view_args);
                return;
            }

            const ForumModel = db.getForumModel();

            try {

                const forum = await ForumModel.findByPk(name, { attributes: ['creator', 'user_mask', 'moderator_mask'] });

                if (forum !== null) {

                    view_args.forum_name = name;

                    if (request.user.username) {

                        const username = request.user.username;

                        // Board admin and forum admin have full permission
                        if (forum.creator === request.user.username || request.user.global_group === pex.GLOBAL_ADMIN) {
                            reply.view('newPost.ejs', view_args);
                            return;
                        }

                        // TODO Can global moderator ignore forum's permission?

                        const ForumModeratorModel = db.getForumModeratorModel();

                        const moderator = await ForumModeratorModel.findOne({
                            where: {
                                username: username,
                                forum_name: name
                            }
                        });

                        if (moderator === null) {
                            // Normal user
                            if (forum.user_mask[pex.forumBit.CREATE_POST] == '1')
                                reply.view('newPost.ejs', view_args);
                            else
                                reply.redirect('/f/' + name);
                        } else {
                            // Moderator of this forum
                            if (forum.moderator_mask[pex.forumBit.CREATE_POST] == '1')
                                reply.view('newPost.ejs', view_args);
                            else
                                reply.redirect('/f/' + name);
                        }

                    } else {
                        // Anonymous
                        if (forum.user_mask[pex.forumBit.ANONYMOUS_POST] == '1')
                            reply.view('newPost.ejs', view_args);
                        else
                            reply.redirect('/f/' + name);
                    }

                } else {
                    // Forum doesn't exists, redirect to home
                    reply.redirect('/');
                }
            } catch (err) {
                console.log(err);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }

    },

    post: async (request, reply) => {
        const name = request.query.f;

        if (name.length > 0) { // if param is like /p?f= , f is an invalid empty string, so redirect user to home

            const view_args = request.view_args;

            if (!pex.isGlobalSet(request.user.global_group, pex.globalBit.VIEW_FORUM)) {

                view_args.back = '/f/' + name;
                view_args.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', view_args);
                return;
            }

            const ForumModel = db.getForumModel();

            try {
                const forum = await ForumModel.findByPk(name, { attributes: ['creator', 'user_mask', 'moderator_mask'] });

                if (forum !== null) {

                    view_args.forum_name = name;

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
                                if (forum.creator !== username && request.user.global_group !== pex.GLOBAL_ADMIN) {
                                    const ForumModeratorModel = db.getForumModeratorModel();

                                    const moderator = await ForumModeratorModel.findOne({
                                        where: {
                                            username: username,
                                            forum_name: name
                                        }
                                    });

                                    if(moderator === null) {
                                        // Normal user
                                        if (forum.user_mask[pex.forumBit.CREATE_POST] != '1') {
                                            reply.redirect('/f/' + name);
                                            return;
                                        }

                                    } else {
                                        // Moderator of this forum
                                        if (forum.moderator_mask[pex.forumBit.CREATE_POST] != '1') {
                                            reply.redirect('/f/' + name);
                                            return;
                                        }

                                    }
                                }
                            } else {
                                if (forum.user_mask[pex.forumBit.ANONYMOUS_POST] == '1') {
                                    creator = null;
                                }
                                else {
                                    reply.redirect('/f/' + name);
                                    return;
                                }
                            }

                            const PostModel = db.getPostModel();

                            await PostModel.create({ forum_name: name, title: data.title, description: data.description, creator: creator });

                            request.flash('info', 'Post created');
                            reply.redirect('/f/' + name);


                        } else {
                            view_args.ERROR = 'Invalid description';
                            reply.view('newPost.ejs', view_args);
                        }
                    } else {
                        view_args.ERROR = 'Invalid title';
                        reply.view('newPost.ejs', view_args);
                    }
                } else {
                    // Forum doesn't exists, redirect to home
                    reply.redirect('/');
                }
            } catch (err) {
                console.log(err);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }
    }
};
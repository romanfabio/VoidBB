const db = require('../database/db');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const {UniqueConstraintError} = require('sequelize');

module.exports = {
    get: (request, reply) => {

        const name = request.query.f;

        if(name.length > 0) { // if param is like /p?f= , f is an invalid empty string, so redirect user to home

            const view_params = request.view_params;

            if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER)) {
                view_params.can_register = true;
            }

            if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.VIEW_FORUM)) {

                view_params.back = '/f/' + name;
                view_params.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', view_params);
                return;
            }

            const ForumModel = db.getForumModel();

            ForumModel.findByPk(name, {attributes: ['creator', 'user_mask', 'moderator_mask']})
                .then((forum) => {
                    if(forum === null) {
                        // Forum doesn't exists, redirect to home
                        reply.redirect('/');
                    } else {

                        view_params.forum_name = name;

                        if(request.is_auth) {
                            
                            if(forum.creator === request.is_auth) {
                                reply.view('newPost.ejs', view_params);
                                return;
                            }

                            const ForumModeratorModel = db.getForumModeratorModel();

                                ForumModeratorModel.findOne({
                                    where: {
                                        username: request.is_auth,
                                        forum_name: name
                                    }
                                })
                                .then((value) => {
                                    if(value === null) {
                                        if(forum.user_mask[pex.forumBit.CREATE_POST] == '1')
                                            reply.view('newPost.ejs', view_params);
                                        else
                                            reply.redirect('/f/' + name);
                                    } else {
                                        if(forum.moderator_mask[pex.forumBit.CREATE_POST] == '1')
                                            reply.view('newPost.ejs', view_params);
                                        else
                                            reply.redirect('/f/' + name);
                                    }
                                }, (err) => {
                                    console.log(err);
                                    reply.redirect('/');
                                });

                        } else {
                            if(forum.user_mask[pex.forumBit.ANONYMOUS_POST] == '1')
                                reply.view('newPost.ejs', view_params);
                            else
                                reply.redirect('/f/' + name);
                        }
                    }
                }, (err) => {
                    console.log(err);
                    reply.redirect('/');
                });
        } else {
            reply.redirect('/');
        }

    },

    post: (request, reply) => {
        const name = request.query.f;

        if(name.length > 0) { // if param is like /p?f= , f is an invalid empty string, so redirect user to home

            const view_params = request.view_params;

            if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER)) {
                view_params.can_register = true;
            }

            if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.VIEW_FORUM)) {

                view_params.back = '/f/' + name;
                view_params.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', view_params);
                return;
            }

            const ForumModel = db.getForumModel();

            ForumModel.findByPk(name, {attributes: ['creator', 'user_mask', 'moderator_mask']})
                .then((forum) => {
                    if(forum === null) {
                        // Forum doesn't exists, redirect to home
                        reply.redirect('/');
                    } else {

                        view_params.forum_name = name;

                        const data = request.body;

                        if(request.is_auth) {
                            
                            if(forum.creator === request.is_auth) {
                                data.title = data.title.trim();
                                if(validator.isPostTitle(data.title)) {
                                    data.description = data.description.trim();

                                    if(validator.isPostDescription(data.description)) {
                                        const PostModel = db.getPostModel();

                                        PostModel.create({forum_name: name, title: data.title, description: data.description, creator: request.is_auth})
                                            .then(() => {
                                                reply.redirect('/f/' + name);
                                            }, (err) => {
                                                console.log(err);
                                                view_params.ERROR = 'An error has occured, retry later';
                                                reply.view('newPost.ejs', view_params);
                                            })
                                    } else {
                                        view_params.ERROR = 'Invalid description';
                                        reply.view('newPost.ejs', view_params);
                                    }
                                } else {
                                    view_params.ERROR = 'Invalid title';
                                    reply.view('newPost.ejs', view_params);
                                }
                                return;
                            }

                            const ForumModeratorModel = db.getForumModeratorModel();

                                ForumModeratorModel.findOne({
                                    where: {
                                        username: request.is_auth,
                                        forum_name: name
                                    }
                                })
                                .then((value) => {
                                    if(value === null) {
                                        if(forum.user_mask[pex.forumBit.CREATE_POST] == '1'){
                                            data.title = data.title.trim();
                                            if(validator.isPostTitle(data.title)) {
                                                data.description = data.description.trim();

                                                if(validator.isPostDescription(data.description)) {
                                                    const PostModel = db.getPostModel();

                                                    PostModel.create({forum_name: name, title: data.title, description: data.description, creator: request.is_auth})
                                                        .then(() => {
                                                            reply.redirect('/f/' + name);
                                                        }, (err) => {
                                                            console.log(err);
                                                            view_params.ERROR = 'An error has occured, retry later';
                                                            reply.view('newPost.ejs', view_params);
                                                        });
                                                } else {
                                                    view_params.ERROR = 'Invalid description';
                                                    reply.view('newPost.ejs', view_params);
                                                }
                                            } else {
                                                view_params.ERROR = 'Invalid title';
                                                reply.view('newPost.ejs', view_params);
                                            }
                                        }
                                        else
                                            reply.redirect('/f/' + name);
                                    } else {
                                        if(forum.moderator_mask[pex.forumBit.CREATE_POST] == '1') {
                                            data.title = data.title.trim();
                                            if(validator.isPostTitle(data.title)) {
                                                data.description = data.description.trim();

                                                if(validator.isPostDescription(data.description)) {
                                                    const PostModel = db.getPostModel();

                                                    PostModel.create({forum_name: name, title: data.title, description: data.description, creator: request.is_auth})
                                                        .then(() => {
                                                            reply.redirect('/f/' + name);
                                                        }, (err) => {
                                                            console.log(err);
                                                            view_params.ERROR = 'An error has occured, retry later';
                                                            reply.view('newPost.ejs', view_params);
                                                        });
                                                } else {
                                                    view_params.ERROR = 'Invalid description';
                                                    reply.view('newPost.ejs', view_params);
                                                }
                                            } else {
                                                view_params.ERROR = 'Invalid title';
                                                reply.view('newPost.ejs', view_params);
                                            }
                                        }
                                        else
                                            reply.redirect('/f/' + name);
                                    }
                                }, (err) => {
                                    console.log(err);
                                    reply.redirect('/');
                                });

                        } else {
                            if(forum.user_mask[pex.forumBit.ANONYMOUS_POST] == '1') {
                                data.title = data.title.trim();
                                if(validator.isPostTitle(data.title)) {
                                    data.description = data.description.trim();

                                    if(validator.isPostDescription(data.description)) {
                                        const PostModel = db.getPostModel();

                                        PostModel.create({forum_name: name, title: data.title, description: data.description, creator: null})
                                            .then(() => {
                                                reply.redirect('/f/' + name);
                                            }, (err) => {
                                                console.log(err);
                                                view_params.ERROR = 'An error has occured, retry later';
                                                reply.view('newPost.ejs', view_params);
                                            })
                                    } else {
                                        view_params.ERROR = 'Invalid description';
                                        reply.view('newPost.ejs', view_params);
                                    }
                                } else {
                                    view_params.ERROR = 'Invalid title';
                                    reply.view('newPost.ejs', view_params);
                                }
                            }
                            else
                                reply.redirect('/f/' + name);
                        }
                    }
                }, (err) => {
                    console.log(err);
                    reply.redirect('/');
                });
        } else {
            reply.redirect('/');
        }
    }
};
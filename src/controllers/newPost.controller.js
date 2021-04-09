const db = require('../database/db');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const {UniqueConstraintError} = require('sequelize');

module.exports = {
    get: (request, reply) => {

        const name = request.query.f;

        if(name.length > 0) { // if param is like /p?f= , f is an invalid empty string, so redirect user to home

            const viewParams = {};

            if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER)) {
                viewParams.can_register = true;
            }

            if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.VIEW_FORUM)) {

                viewParams.back = '/f/' + name;
                viewParams.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', viewParams);
                return;
            }

            const ForumModel = db.getForumModel();

            ForumModel.findByPk(name, {attributes: ['creator', 'user_mask', 'moderator_mask']})
                .then((forum) => {
                    if(forum === null) {
                        // Forum doesn't exists, redirect to home
                        reply.redirect('/');
                    } else {

                        viewParams.forum_name = name;

                        if(request.is_auth) {

                            viewParams.USERNAME = request.is_auth;
                            
                            if(forum.creator === request.is_auth) {
                                reply.view('newPost.ejs', viewParams);
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
                                            reply.view('newPost.ejs', viewParams);
                                        else
                                            reply.redirect('/f/' + name);
                                    } else {
                                        if(forum.moderator_mask[pex.forumBit.CREATE_POST] == '1')
                                            reply.view('newPost.ejs', viewParams);
                                        else
                                            reply.redirect('/f/' + name);
                                    }
                                }, (err) => {
                                    console.log(err);
                                    reply.redirect('/');
                                });

                        } else {
                            if(forum.user_mask[pex.forumBit.ANONYMOUS_POST] == '1')
                                reply.view('newPost.ejs', viewParams);
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

    }
};
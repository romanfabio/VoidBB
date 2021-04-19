const db = require('../database/db');
const pex = require('../util/permissionManager');
const { Op } = require("sequelize");

module.exports = {
    get: (request, reply) => {
        const name = request.params.name;

        if(name.length > 0) { // if url ends with /f/ , name is an invalid empty string, so redirect user to home

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

            ForumModel.findByPk(name, {attributes: ['description', 'creator', 'user_mask', 'moderator_mask']})
                .then((forum) => {
                    if(forum === null) {
                        // Forum doesn't exists, redirect to home
                        reply.redirect('/');
                    } else {

                        const PostModel = db.getPostModel();

                        PostModel.findAll({
                            where: {
                                forum_name: {
                                    [Op.eq]: name
                                }
                            }
                        }).then((posts) => {

                            view_params.forum_name = name;
                            view_params.posts = posts;
                            view_params.styles = ['preview-list.css'];

                            if(request.is_auth) {

                                if(forum.creator === request.is_auth) {
                                    //Admin have full permission
                                    view_params.can_create_post = true;
                                    reply.view('viewForum.ejs', view_params);
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
                                            view_params.can_create_post = true;
                                    } else {
                                        if(forum.moderator_mask[pex.forumBit.CREATE_POST] == '1')
                                            view_params.can_create_post = true;
                                    }
                                    reply.view('viewForum.ejs', view_params);
                                }, (err) => {
                                    console.log(err);
                                    reply.redirect('/');
                                });
                            } else {
                                if(forum.user_mask[pex.forumBit.ANONYMOUS_POST] == '1')
                                    view_params.can_create_post = true;
                                reply.view('viewForum.ejs', view_params);
                            }

                            
                        }, (err) => {
                            console.log(err);
                            reply.redirect('/');
                        });
                        
                    }
                }, (err) => {
                    console.log(err);
                    reply.redirect('/');
                });
        } else {
            reply.redirect('/');
        }
    }
}
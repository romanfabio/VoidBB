const db = require('../database/db');
const pex = require('../util/permissionManager');
const { Op } = require("sequelize");

module.exports = {
    get: async (request, reply) => {
        const name = request.params.name;

        if(name.length > 0) { // if url ends with /f/ , name is an invalid empty string, so redirect user to home

            const view_args = request.view_args;

            if(!pex.isGlobalSet(request.user.global_group, pex.globalBit.VIEW_FORUM)) {

                view_args.back = '/f/' + name;
                view_args.ERROR = 'You must be logged to do that';

                reply.view('login.ejs', view_args);
                return;
            }

            const ForumModel = db.getForumModel();

            try {
                const forum = await ForumModel.findByPk(name, {attributes: ['description', 'creator', 'user_mask', 'moderator_mask']});

                if(forum !== null) {

                    const PostModel = db.getPostModel();

                    const posts = await PostModel.findAll({
                        where: {
                            forum_name: {
                                [Op.eq]: name
                            }
                        }
                    });

                    view_args.forum_name = name;
                    view_args.posts = posts;
                    view_args.styles = ['preview-list.css'];

                    if(request.user.username) {

                        if(forum.creator === request.user.username || request.user.global_group === pex.GLOBAL_ADMIN) {
                            //Admin has full permission
                            view_args.can_create_post = true;
                            reply.view('viewForum.ejs', view_args);
                            return;
                        }

                        // TODO Can global moderator ignore forum's permission?

                        const ForumModeratorModel = db.getForumModeratorModel();

                        const mod = await ForumModeratorModel.findOne({
                            where: {
                                username: request.user.username,
                                forum_name: name
                            }
                        });

                        if(mod !== null) {
                            if(forum.moderator_mask[pex.forumBit.CREATE_POST] == '1')
                                view_args.can_create_post = true;
                        } else {
                            if(forum.user_mask[pex.forumBit.CREATE_POST] == '1')
                                view_args.can_create_post = true;
                        }

                    } else {
                        if(forum.user_mask[pex.forumBit.ANONYMOUS_POST] == '1')
                            view_args.can_create_post = true;
                    }

                    reply.view('viewForum.ejs', view_args);

                } else {
                    reply.redirect('/');
                }
            } catch(err) {
                console.log(err);
                reply.redirect('/');
            }
        } else {
            reply.redirect('/');
        }

    }
}
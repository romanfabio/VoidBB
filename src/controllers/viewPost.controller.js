const db = require('../database/db');
const pex = require('../util/permissionManager');
const cache = require('../util/cache');
const { Op } = require("sequelize");
const validator = require('../util/validator');
const user = require('../database/models/user');

module.exports = {
    get: async (request, reply) => {
        const id = request.params.id;

        const view_args = request.view_args;

        if (!pex.isGlobalSet(request.user.global_group, pex.globalBit.VIEW_FORUM)) {

            view_args.back = '/p/' + id;
            view_args.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', view_args);
            return;
        }

        const PostModel = db.getPostModel();

        try {
            const post = await PostModel.findByPk(id);

            if (post !== null) {
                view_args.post = post;

                const CommentModel = db.getCommentModel();

                const comments = await CommentModel.findAll({
                    where: {
                        post_id: {
                            [Op.eq]: post.id
                        }
                    }
                });

                view_args.comments = comments;

                const forum = await getForumByPost(post);

                if(forum === null) {
                    reply.redirect('/');
                    return;
                }

                const can_comment = await canComment(request, forum, post);

                if(can_comment === null) {
                    reply.redirect('/');
                    return;
                }


                if(can_comment) {
                    view_args.can_comment = true;
                }

                reply.view('viewPost.ejs', view_args);

            } else {
                reply.redirect('/');
            }
        } catch (err) {
            console.log(err);
            reply.redirect('/');
        }

    },

    post: async (request, reply) => {
        const id = request.params.id;

        const view_args = request.view_args;

        if (!pex.isGlobalSet(request.user.global_group, pex.globalBit.VIEW_FORUM)) {

            view_args.back = '/p/' + id;
            view_args.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', view_args);
            return;
        }

        const data = request.body;
        data.description = data.description.trim();

        const PostModel = db.getPostModel();
        try {

            const post = await PostModel.findByPk(id);

            if(post !== null) {
                view_args.post = post;

                const CommentModel = db.getCommentModel();

                const comments = await CommentModel.findAll({
                    where: {
                        post_id: {
                            [Op.eq]: post.id
                        }
                    }
                });

                view_args.comments = comments;

                const forum = await getForumByPost(post);

                if(forum === null) {
                    reply.redirect('/');
                    return;
                }

                const can_comment = await canComment(request, forum, post);

                if(can_comment === null) {
                    reply.redirect('/');
                    return;
                }

                if(can_comment) {
                    view_args.can_comment = true;
                } else {
                    reply.view('viewPost.ejs', view_args);
                    return;
                }

                if(validator.isComment(data.description)) {

                    const CommentModel = db.getCommentModel();

                    try {

                        await CommentModel.create({post_id: id, reply: null, description: data.description, creator: (request.user.username?request.user.username:null)});

                        reply.redirect('/p/' + id);
                    } catch(err) {
                        console.log(err);
                        view_args.ERROR = 'An error has occured, retry later';
                        reply.view('viewPost.ejs', view_args);
                    }
                } else {
                    view_args.ERROR = 'Invalid comment';
                    reply.view('viewPost.ejs', view_args);
                }

            } else {
                reply.redirect('/');
            }
        } catch(err) {
            console.log(err);
            reply.redirect('/');
        }
    }
};


async function getForumByPost(post) {

    let forum = cache.forum(post.forum_name);
    if(!forum) {
                    
        const ForumModel = db.getForumModel();

        try {

            forum = await ForumModel.findByPk(post.forum_name, {attributes: ['creator', 'user_mask', 'moderator_mask']});

            if(forum !== null) {
                cache.invalidate_forum(post.forum_name, {creator: forum.creator, user_mask: forum.user_mask, moderator_mask: forum.moderator_mask});
            }

        } catch(err) {
            console.log(err);
            forum = null;
        }
    }

    return forum;
}

/**
 * @returns true if user has permission to comment, otherwise return false. Return null if a database's error occurs.
 */
async function canComment(request, forum, post) {

    let result = false;

    if(request.user.username) {

        if(request.user.username === forum.creator || request.user.global_group === pex.GLOBAL_ADMIN) {
            result = true;
        } else {
            try {
                // TODO Can global moderator ignore forum's permission?

                const ForumModeratorModel = db.getForumModeratorModel();

                const mod = await ForumModeratorModel.findOne({
                    where: {
                        username: request.user.username,
                        forum_name: post.forum_name
                    }
                });

                if (mod !== null) {
                    if (forum.moderator_mask[pex.forumBit.CREATE_COMMENT] == '1')
                        result = true;
                } else {
                    if (forum.user_mask[pex.forumBit.CREATE_COMMENT] == '1')
                        result = true;
                }
            } catch(err) {
                console.log(err);
                result = null;
            }
        }
    } else {
        if (forum.user_mask[pex.forumBit.ANONYMOUS_COMMENT] == '1')
            result = true;
    }

    return result;
}
const db = require('../database/db');
const viewer = require('../util/viewer');
const { Op } = require("sequelize");

module.exports = {
    get: (request, reply) => {
        const name = request.params.name;

        if(name.length > 0) {

            const ForumModel = db.getForumModel();

            ForumModel.findByPk(name, {attributes: ['description', 'creator']})
                .then((forum) => {
                    if(forum === null) {
                        viewer.deadend(reply, {back: '/', error: 'Forum doesn\'t exists'});
                    } else {
                        
                        const PostModel = db.getPostModel();

                        PostModel.findAll({
                            where: {
                                forum_id: {
                                    [Op.eq]: name
                                }
                            }
                        }).then((value) => {
                            viewer.viewForum(reply, {posts: value});
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
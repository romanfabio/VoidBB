const db = require('../database/db');
const pex = require('../util/permissionManager');
const { Op } = require("sequelize");

module.exports = {
    get: (request, reply) => {
        const id = request.params.id;

        const view_params = request.view_params;

        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER)) {
            view_params.can_register = true;
        }

        if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.VIEW_FORUM)) {

            view_params.back = '/p/' + id;
            view_params.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', view_params);
            return;
        }

        const PostModel = db.getPostModel();

        PostModel.findByPk(id)
            .then((post) => {
                if(post === null) {
                    //Post doesn't exists, redirect to home
                    reply.redirect('/');
                } else {

                    view_params.forum_name = post.forum_name;
                    view_params.title = post.title;
                    view_params.description = post.description;
                    view_params.creator = post.creator;
                    view_params.created = post.created;

                    reply.view('viewPost.ejs', view_params);
                }
            }, (err) => {
                console.log(err);
                reply.redirect('/');
            });
    }
}
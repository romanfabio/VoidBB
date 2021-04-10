const db = require('../database/db');
const pex = require('../util/permissionManager');
const { Op } = require("sequelize");

module.exports = {
    get: (request, reply) => {
        const id = request.params.id;

        const viewParams = {};

        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER)) {
            viewParams.can_register = true;
        }

        if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.VIEW_FORUM)) {

            viewParams.back = '/p/' + id;
            viewParams.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', viewParams);
            return;
        }

        const PostModel = db.getPostModel();

        PostModel.findByPk(id)
            .then((post) => {
                if(post === null) {
                    //Post doesn't exists, redirect to home
                    reply.redirect('/');
                } else {
                    if(request.is_auth)
                        viewParams.USERNAME = request.is_auth;

                    viewParams.forum_name = post.forum_name;
                    viewParams.title = post.title;
                    viewParams.description = post.description;
                    viewParams.creator = post.creator;
                    viewParams.created = post.created;

                    reply.view('viewPost.ejs', viewParams);
                }
            }, (err) => {
                console.log(err);
                reply.redirect('/');
            });
    }
}
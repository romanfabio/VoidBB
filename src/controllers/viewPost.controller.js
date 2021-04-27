const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {
    get: async (request, reply) => {
        const id = request.params.id;

        const view_args = request.view_args;

        if(!pex.isGlobalSet(request.user.global_group, pex.globalBit.VIEW_FORUM)) {

            view_args.back = '/p/' + id;
            view_args.ERROR = 'You must be logged to do that';

            reply.view('login.ejs', view_args);
            return;
        }

        const PostModel = db.getPostModel();

        try {
            const post = await PostModel.findByPk(id);

            if(post !== null) {
                view_args.forum_name = post.forum_name;
                view_args.title = post.title;
                view_args.description = post.description;
                view_args.creator = post.creator;
                view_args.created = post.created;

                reply.view('viewPost.ejs', view_args);

            }
        } catch(err) {
            console.log(err);
            reply.redirect('/');
        }

    }
};
const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {
    get: async (request, reply) => {

        const view_args = request.view_args;
        view_args.styles = ['preview-list.css'];

        if(pex.isGlobalSet(request.user.global_group, pex.globalBit.CREATE_FORUM))
            view_args.can_create_forum = true;

        const forumModel = db.getForumModel();

        try {
            const forums = await forumModel.findAll();

            view_args.forums = forums;
        } catch(err) {
            console.log(err);
            view_args.ERROR = 'An error has occured, retry later';
        }

        reply.view('home.ejs', view_args);
    }
};
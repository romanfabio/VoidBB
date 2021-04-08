const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {

        const viewParams = {};

        if(request.is_auth)
            viewParams.user_username = request.is_auth;

        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.CREATE_FORUM))
            viewParams.can_create_forum = true;

        const forumModel = db.getForumModel();

        forumModel.findAll().then((forums) => {

            viewParams.forums = forums;
            reply.view('home.ejs', viewParams);
            
        }, (err) => {
            viewParams.error = 'An error has occured, retry later';
            viewer.home(reply, viewParams);
        });
    }
}
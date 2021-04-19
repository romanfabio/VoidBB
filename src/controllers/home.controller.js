const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {

        const view_params = request.view_params;
        view_params.styles = ['preview-list.css'];

       
        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER))
            view_params.can_register = true;

        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.CREATE_FORUM))
            view_params.can_create_forum = true;

        const forumModel = db.getForumModel();

        forumModel.findAll().then((forums) => {

            view_params.forums = forums;
            reply.view('home.ejs', view_params);
            
        }, (err) => {
            view_params.ERROR = 'An error has occured, retry later';
            reply.view('home.ejs', view_params);
        });
    }
}
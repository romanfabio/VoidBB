const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {

        const viewParams = {styles: ['preview-list.css']};

        if(request.is_auth)
            viewParams.USERNAME = request.is_auth;
        else {
            if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER))
                viewParams.can_register = true;
        }

        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.CREATE_FORUM))
            viewParams.can_create_forum = true;

        const forumModel = db.getForumModel();

        forumModel.findAll().then((forums) => {

            viewParams.forums = forums;
            reply.view('home.ejs', viewParams);
            
        }, (err) => {
            viewParams.ERROR = 'An error has occured, retry later';
            reply.view('home.ejs', viewParams);
        });
    }
}
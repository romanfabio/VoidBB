const db = require('../database/db');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const {UniqueConstraintError} = require('sequelize');

module.exports = {
    get: (request, reply) => {
        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.CREATE_FORUM)) { //If CREATE_FORUM is set then REGISTER must be set

            // User must be registered, request.is_auth is always valid
            reply.view('newForum.ejs', request.view_params);
        }
        else {
            reply.redirect('/');
        }
    },

    post: (request, reply) => {

        if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.CREATE_FORUM)) {
            reply.redirect('/');
            return;
        }

        // User must be registered, request.is_auth is always valid
        const view_params = request.view_params;


        const data = request.body;
        data.name = data.name.trim();
        data.description = data.description.trim();

        if(validator.isForumName(data.name)) {
            if(validator.isForumDescription(data.description)) {
                //Forums can't contain uppercase letter
                data.name = data.name.toLowerCase();

                const ForumModel = db.getForumModel();

                ForumModel.create({name: data.name, description: data.description, creator: request.is_auth, user_mask: '0000000', moderator_mask: '00000000'})
                    .then(() => {
                        reply.redirect('/f/' + data.name);
                    }, (err) => {
                        console.log(err);
                        view_params.ERROR = 'An error has occured, retry later';
                        reply.view('newForum.ejs', view_params);
                    });
                    
            } else {
                view_params.ERROR = 'Invalid Description';
                reply.view('newForum.ejs', view_params);
            }
        } else {
            view_params.ERROR = 'Invalid Name';
            reply.view('newForum.ejs', view_params);
        }
    }
};
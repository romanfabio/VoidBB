const viewer = require('../util/viewer');
const db = require('../database/db');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(pex.isGlobalSet(request.user_global_group, pex.globalBit.CREATE_FORUM)) {
            const viewParams = {};

            if(request.is_auth)
                viewParams.user_username = request.is_auth;

            viewer.newForum(reply, viewParams);
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

        const viewParams = {};

        if(request.is_auth)
            viewParams.user_username = request.is_auth;


        const data = request.body;
        data.name = data.name.trim();
        data.description = data.description.trim();

        if(validator.isForumName(data.name)) {
            if(validator.isForumDescription(data.description)) {
                //I forum non possono contenere lettere maiuscole
                data.name = data.name.toLowerCase();

                const ForumModel = db.getForumModel();

                ForumModel.create({name: data.name, description: data.description, creator: request.is_auth}).then((value) => {
                    reply.redirect('/');
                }, (err) => {
                    console.log(err);
                    viewParams.error = 'A forum with that name already exists';
                    viewer.newForum(reply, viewParams);
                });
            } else {
                viewParams.error = 'Invalid description';
                viewer.newForum(reply, viewParams);
            }
        } else {
            viewParams.error = 'Invalid name';
            viewer.newForum(reply, viewParams);
        }
    }
};
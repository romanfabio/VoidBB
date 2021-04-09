const db = require('../database/db');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');
const {UniqueConstraintError} = require('sequelize');

module.exports = {
    get: (request, reply) => {
        reply.view('newPost.ejs', {forum_name: request.query.f});
    },

    post: (request, reply) => {

        if(!pex.isGlobalSet(request.user_global_group, pex.globalBit.CREATE_FORUM)) {
            reply.redirect('/');
            return;
        }

        const viewParams = {};

        if(request.is_auth)
            viewParams.user_username = request.is_auth;
        else {
            if(pex.isGlobalSet(request.user_global_group, pex.globalBit.REGISTER))
                viewParams.can_register = true;
        }


        const data = request.body;
        data.name = data.name.trim();
        data.description = data.description.trim();

        if(validator.isForumName(data.name)) {
            if(validator.isForumDescription(data.description)) {
                //I forum non possono contenere lettere maiuscole
                data.name = data.name.toLowerCase();

                const ForumModel = db.getForumModel();
                const ForumGroupModel = db.getForumGroupModel();
                const ForumUserModel = db.getForumUserModel();
                let transaction = null;

                db.generateTransaction()
                    .then((value) => {
                        transaction = value;
                        return ForumModel.create({name: data.name, description: data.description, creator: request.is_auth}, {transaction});
                    })
                    .then(() => {
                        return ForumGroupModel.bulkCreate([
                            {forum_name: data.name, name: 'admin', mask: '0000'},
                            {forum_name: data.name, name: 'moderator', mask: '0000'},
                            {forum_name: data.name, name: 'guest', mask: '0000'}
                        ], {transaction});
                    })
                    .then((groups) => {
                        return ForumUserModel.create({username: request.is_auth, group_id: groups[0].id}, {transaction});
                    })
                    .then(() => {
                        return transaction.commit();
                    })
                    .then(() => {
                        reply.redirect('/f/' + data.name);
                    })
                    .catch((err) => {
                        transaction.rollback();
                        console.log(err);
                        if(err instanceof UniqueConstraintError)
                            viewParams.error = 'A forum with that name already exists';
                        else
                            viewParams.error = 'An error has occured, retry later';
                        reply.view('newForum.ejs', viewParams);
                    });
            } else {
                viewParams.error = 'Invalid Description';
                reply.view('newForum.ejs', viewParams);
            }
        } else {
            viewParams.error = 'Invalid Name';
            reply.view('newForum.ejs', viewParams);
        }
    }
};
const viewer = require('../util/viewer');
const db = require('../database/db');
const validator = require('validator');

module.exports = {
    get: (request, reply) => {
        const viewParams = {};

        if(request.isAuth) {
            viewParams.auth = request.authUsername;
            viewer.newForum(reply, viewParams);
        }
        else {
            viewParams.error = 'You must be logged to create forums';
            viewer.login(reply, viewParams);
        }
    },

    post: (request, reply) => {

        const viewParams = {};

        if(!request.isAuth) {
            viewParams.error = 'You must be logged to create forums';
            viewer.login(reply, viewParams);
            return;
        }

        viewParams.auth = request.authUsername;

        const data = request.body;
        data.name = validator.trim(data.name);
        data.description = validator.trim(data.description);

        if(fieldValidator.isNotEmpty(data.name)) {
            if(fieldValidator.isNotEmpty(data.description)) {
                const ForumModel = db.getForumModel();

                ForumModel.create({name: data.name, description: data.description}).then((value) => {
                    reply.redirect('/');
                }, (err) => {
                    request.log.info(err);
                    viewParams.error = 'An error has occured, retry later';
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
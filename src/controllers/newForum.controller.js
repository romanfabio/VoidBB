const viewer = require('../util/viewer');
const db = require('../database/db');
const fieldValidator = require('../util/fieldValidator');
const validator = require('validator');

module.exports = {
    get: (request, reply) => {
        if(request.isAuth) {
            viewer.newForum(reply, {auth: request.authUsername});
        }
        else {
            viewer.login(reply, {error: 'You must be logged to create forums'});
        }
    },

    post: (request, reply) => {

        if(!request.isAuth) {
            viewer.login(reply, {error: 'You must be logged to create forums'});
            return;
        }

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
                    viewer.newForum(reply, {auth: request.authUsername, error: 'An error has occured, retry later'});
                });
            } else {
                viewer.newForum(reply, {auth: request.authUsername, error: 'Invalid description'});
            }
        } else {
            viewer.newForum(reply, {auth: request.authUsername, error: 'Invalid name'});
        }
    }
};
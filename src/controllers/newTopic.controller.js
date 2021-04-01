const db = require('../database/db');
const validator = require('validator');
const fieldValidator = require('../util/fieldValidator');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {

        if(request.isAuth) {
            viewer.newTopic(reply, {auth: request.authUsername});
        }
        else {
            viewer.login(reply, {error: 'You must be logged to create topics'});
        }
    },

    post: (request, reply) => {

        if(!request.isAuth) {
            viewer.login(reply, {error: 'You must be logged to create topics'});
            return;
        }

        const data = request.body;
        data.title = validator.trim(data.title);
        data.description = validator.trim(data.description);

        if(fieldValidator.isNotEmpty(data.title)) {
            if(fieldValidator.isNotEmpty(data.description)) {
                const TopicModel = db.getTopicModel();

                TopicModel.create({title: data.title, description: data.description, creator: request.authUsername}).then((value) => {
                    reply.redirect('/');
                }, (err) => {
                    request.log.info(err);
                    viewer.newTopic(reply, {error: 'An error has occured, retry later'});
                });
            } else {
                viewer.newTopic(reply, {error: 'Invalid description'});
            }
        } else {
            viewer.newTopic(reply, {error: 'Invalid title'});
        }
        
    }
}
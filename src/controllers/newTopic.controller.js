const db = require('../database/db');
const validator = require('validator');
const fieldValidator = require('../util/fieldValidator');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {
        if(request.isAuth) {
            viewer.newTopic(reply, {auth: request.authUsername, forum: request.query.f});
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
        data.name = validator.trim(data.name);
        if(fieldValidator.isNotEmpty(data.description)) {
            if(fieldValidator.isNotEmpty(data.name)) {
                const TopicModel = db.getTopicModel();
                const PostModel = db.getPostModel();

                let trans;
                db.generateTransaction()
                    .then((value) => {
                        trans = value;
                        return TopicModel.create({forum_id: request.query.f, name: data.name}, {transaction: trans});
                    })
                    .then((value) => {
                        return PostModel.create({topic_id: value.id, description: data.description, creator: request.authUsername}, {transaction: trans});
                    })
                    .then(() => {
                        return trans.commit();
                    })
                    .then(() => {
                        reply.redirect('/forum/' + request.query.f);
                    })
                    .catch((err) => {
                        trans.rollback();
                        request.log.info(err);
                        viewer.newTopic(reply, {auth: request.authUsername, forum: request.query.f, error: 'An error has occured, retry later'});     
                    });
            } else {
                viewer.newTopic(reply, {auth: request.authUsername, forum: request.query.f, error: 'Invalid name'});
            }
        } else {
            viewer.newTopic(reply, {auth: request.authUsername, forum: request.query.f, error: 'Invalid description'});
        }
    }
}
const db = require('../database/db');
const validator = require('validator');
//const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {
        const viewParams = {};

        if(request.isAuth) {
            viewParams.auth = request.authUsername;
            viewParams.forum = request.query.f;
            viewer.newTopic(reply, viewParams);
        }
        else {
            viewParams.error = 'You must be logged to create topics';
            viewer.login(reply, viewParams);
        }
    },

    post: (request, reply) => {

        const viewParams = {};

        if(!request.isAuth) {
            viewParams.error = 'You must be logged to create topics';
            viewer.login(reply, viewParams);
            return;
        }

        viewParams.auth = request.authUsername;
        viewParams.forum = request.query.f;

        const data = request.body;
        data.name = validator.trim(data.name);
        data.description = validator.trim(data.description);

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
                        viewParams.error = 'An error has occured, retry later';
                        viewer.newTopic(reply, viewParams);     
                    });
            } else {
                viewParams.error = 'Invalid name';
                viewer.newTopic(reply, viewParams);
            }
        } else {
            viewParams.error = 'Invalid description';
            viewer.newTopic(reply, viewParams);
        }
    }
}
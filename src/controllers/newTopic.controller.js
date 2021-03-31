const db = require('../database/db');

module.exports = {
    get: (request, reply) => {
        reply.view('newTopic.ejs', {title: 'New Topic'});
    },

    post: (request, reply) => {
        const data = request.body;
        const TopicModel = db.getTopicModel();

                    TopicModel.create({title: data.title, description: data.description, creator: 'mrvoid'}).then((value) => {
                        reply.redirect('/');
                    }, (err) => {
                        request.log.info(err);
                        reply.view('newTopic.ejs', {title: 'New Topic', error: 'An error has occured, retry later'});
                    });
    }
}
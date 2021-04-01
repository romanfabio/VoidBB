const db = require('../database/db');
const validator = require('validator');
const fieldValidator = require('../util/fieldValidator');

module.exports = {
    get: (request, reply) => {
        const viewParams = { title: 'New Topic' };

        if(request.isAuth) {
            viewParams.auth = request.authUsername;
            reply.view('newTopic.ejs', viewParams);
        }
        else {
            reply.view('login.ejs', {title: 'Login', error: 'You must be logged to create topics'});
        }
    },

    post: (request, reply) => {

        if(!request.isAuth) {
            reply.view('login.ejs', {title: 'Login', error: 'You must be logged to create topics'});
            return;
        }

        const viewParams = {title: 'New Topic' };
        
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
                    viewParams.error = 'An error has occured, retry later';
                    reply.view('newTopic.ejs', viewParams);
                });
            } else {
                viewParams.error = 'Invalid description';
                reply.view('newTopic.ejs', viewParams);
            }
        } else {
            viewParams.error = 'Invalid title';
            reply.view('newTopic.ejs', viewParams);
        }
        
    }
}
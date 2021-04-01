const db = require('../database/db');

module.exports = {
    get: (request, reply) => {
        if(request.isAuth)
            reply.view('newTopic.ejs', {title: 'New Topic'});
        else
            reply.view('login.ejs', {title: 'Login', error: 'You must be logged to create topics'});
    },

    post: (request, reply) => {
        const auth = request.session-this.get('username');
        
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
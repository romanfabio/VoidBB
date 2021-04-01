const db = require('../database/db');

module.exports = {
    get: (request, reply) => {

        const viewParams = { title: 'Home', styles: ['home.css'] };

        const topicModel = db.getTopicModel();

        topicModel.findAll().then((value) => {

            viewParams.topics = value;
            if(request.isAuth)
                viewParams.auth = request.authUsername;
            
            reply.view('home.ejs', viewParams);
        }, (err) => {
            viewParams.error = 'An error has occured, retry later';
            reply.view('home.ejs', viewParams);
        });
    }
}
const db = require('../database/db');

module.exports = {
    get: (request, reply) => {

        const topicModel = db.getTopicModel();

        topicModel.findAll().then((value) => {
            const auth = request.session.get('username');
            if(auth)
                reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: value, auth: auth});
            else
                reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: value});
        }, (err) => {
            reply.view('home.ejs', {title: 'Home', styles: ['home.css'], error: 'An error has occured, retry later'});
        });
    }
}
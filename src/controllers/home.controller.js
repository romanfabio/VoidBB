const db = require('../database/db');

module.exports = {
    get: (request, reply) => {
        console.log(request);
        const topicModel = db.getTopicModel();

        topicModel.findAll().then((value) => {
            if(request.isAuth)
                reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: value, auth: request.authUsername});
            else
                reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: value});
        }, (err) => {
            reply.view('home.ejs', {title: 'Home', styles: ['home.css'], error: 'An error has occured, retry later'});
        });
    }
}
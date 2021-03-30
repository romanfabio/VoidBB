const db = require('../database/db');

module.exports = {
    get: (request, reply) => {
        const auth = request.session.get('username');

        const userModel = db.getUserModel();

        userModel.findAll().then((value) => {

            reply.view('home.ejs', {title: 'Home', styles: ['home.css'], topics: [{title: 'Ciao', description: "Come va?"}],users: value});
        }, (err) => {
            reply.view('home.ejs', {title: 'Home', styles: ['home.css'], error: 'An error has occured, retry later'});
        });
    }
}
const db = require('../database/db');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {
        const viewParams = {};
        if(request.is_auth)
            viewParams.user_username = request.is_auth;

        const forumModel = db.getForumModel();

        forumModel.findAll().then((value) => {

            viewParams.forums = value;
            
            viewer.home(reply, viewParams);
        }, (err) => {
            viewParams.error = 'An error has occured, retry later';
            viewer.home(reply, viewParams);
        });
    }
}
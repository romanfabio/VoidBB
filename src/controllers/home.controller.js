const db = require('../database/db');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {

        const forumModel = db.getForumModel();

        forumModel.findAll().then((value) => {

            const viewParams = {forums: value};
            if(request.isAuth)
                viewParams.auth = request.authUsername;
            
            viewer.home(reply, viewParams);
        }, (err) => {
            viewer.home(reply, {error: 'An error has occured, retry later'});
        });
    }
}
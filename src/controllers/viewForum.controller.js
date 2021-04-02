const db = require('../database/db');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {
        const viewParams = {};
        if(request.isAuth)
            viewParams.auth = request.authUsername;

        viewParams.forum = request.params.id;

        const topicModel = db.getTopicModel();

        topicModel.findAll({
            where: { forum_id: request.params.id}
        }).then((value) => {
            
            viewParams.topics = value;
            
            viewer.viewForum(reply, viewParams);
        }, (err) => {
            viewParams.error = 'An error has occured, retry later';
            viewer.viewForum(reply, viewParams);
        });
    }
}
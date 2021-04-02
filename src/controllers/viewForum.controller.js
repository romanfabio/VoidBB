const db = require('../database/db');
const viewer = require('../util/viewer');

module.exports = {
    get: (request, reply) => {

        const topicModel = db.getTopicModel();

        topicModel.findAll({
            where: { forum_id: request.params.id}
        }).then((value) => {

            const viewParams = {topics: value, forum: request.params.id};
            if(request.isAuth)
                viewParams.auth = request.authUsername;
            
            viewer.viewForum(reply, viewParams);
        }, (err) => {
            viewer.viewForum(reply, {forum: request.params.id, error: 'An error has occured, retry later'});
        });
    }
}
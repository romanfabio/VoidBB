const viewForumController = require('../controllers/viewForum.controller');
const newForumController = require('../controllers/newForum.controller');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/forum/:id',
        schema: {
            params: {
                id: {type: 'integer'}
            }
        },
        handler: viewForumController.get
    });

    app.route({
        method: 'GET',
        url: '/newforum',
        handler: newForumController.get
    });

    app.route({
        method: 'POST',
        url: '/newforum',
        schema: {
            body: {
                type: "object",
                properties: {
                    name: {type: 'string', nullable: false},
                    description: {type: 'string', nullable: false}
                },
                required: ['name','description']
            }
        },
        handler: newForumController.post
    });
};
const newPostController = require('../controllers/newPost.controller');
const getMeHook = require('./hooks/getMeHook');

module.exports = (app) => {

    app.route({
        method: 'GET',
        url: '/p',
        schema: {
            querystring: {
                type: "object",
                properties: {
                    f: {type: 'string', nullable: false},
                },
                required: ['f']
            }
        },
        handler: newPostController.get,
        onRequest: getMeHook
    });

  /*   app.route({
        method: 'POST',
        url: '/f',
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
        handler: newForumController.post,
        onRequest: getMeHook
    }); */
};
const viewUserController = require('../controllers/viewUser.controller');
const getMeHook = require('./hooks/getMeHook');

module.exports = (app) => {

    app.route({
        method: 'GET',
        url: '/u/:username',
        schema: {
            params: {
                type: "object",
                properties: {
                    username: {type: "string"}
                },
                required: ['username']
            }
        },
        handler: viewUserController.get,
        onRequest: getMeHook
    });
};
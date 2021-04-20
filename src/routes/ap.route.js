const apGeneralController = require('../controllers/apGeneral.controller');
const getMeHook = require('./hooks/getMeHook');

module.exports = (app) => {
    app.route({
        method: 'GET',
        url: '/ap/general',
        handler: apGeneralController.get,
        onRequest: getMeHook 
    });

    app.route({
        method: 'POST',
        url: '/ap/general',
        schema: {
            body: {
                type: "object",
                properties: {
                    board_name: {type: 'string', nullable: false}
                },
                required: ['board_name']
            }
        },
        handler: apGeneralController.post,
        onRequest: getMeHook
    });
};
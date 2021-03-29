const homeController = require('./../controllers/home.controllers');
async function routes(fastify, options) {

    fastify.get('/', homeController);
}

module.exports = routes;
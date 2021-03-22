async function routes(fastify, options) {

    fastify.get('/', (request, reply) => {
        reply.view('index.ejs', {title: 'Home'});
    });
}

module.exports = routes;
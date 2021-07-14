require('dotenv').config();
const PORT = process.env.BOARD_PORT || 3000;

const fastify = require('fastify')({ logger: false });
const path = require('path');
const routes = require('./src/routes/routes');
const pex = require('./src/util/permissionManager');
const variableManager = require('./src/util/variableManager');
const cache = require('./src/util/cache');

(async function () {

    await fastify.register(require('fastify-formbody'));

    await fastify.register(require('fastify-secure-session'), {
        cookieName: 'voidbb',
        secret: process.env.SECRET,
        cookie: {
            path: '/',
            httpOnly: true,
            sameSite: 'strict'
        }
    });

    await fastify.register(require('fastify-csrf'), { sessionPlugin: 'fastify-secure-session' });

    await fastify.register(require('fastify-flash'));

    await fastify.register(require('fastify-static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/'
    });

    await fastify.register(require('point-of-view'), {
        engine: {
            ejs: require('ejs')
        },
        root: path.join(__dirname, 'src/views'),
        layout: 'layouts/default.ejs'
    });


    const knex = require('knex')({
        debug: true,
        client: process.env.DB_DRIVER,
        connection: {
            host : process.env.DB_HOST,
            user : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_NAME
        }
    });

    try {
        await variableManager.reload(knex);
        await pex.reload(knex);
        cache.init(knex);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    fastify.decorate('database', knex);

    routes(fastify);

    fastify.listen(PORT, e => {
        if (e) {
            console.error(e);
            process.exit(1);
        }
        else
            console.info('Server running on port ' + PORT);
    });


})();
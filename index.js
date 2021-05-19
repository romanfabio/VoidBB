require('dotenv').config();
const PORT = process.env.BOARD_PORT || 3000;

const fastify = require('fastify')({ logger: false });
const fs = require('fs');
const path = require('path');
const routes = require('./src/routes/routes');
const pex = require('./src/util/permissionManager');
const variableManager = require('./src/util/variableManager');

(async function () {

    fastify.register(require('fastify-formbody'));

    fastify.register(require('fastify-secure-session'), {
        cookieName: 'voidbb',
        secret: process.env.SECRET,
        cookie: {
            path: '/'
        }
    });

    fastify.register(require('fastify-flash'));

    fastify.register(require('fastify-static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/'
    });

    fastify.register(require('point-of-view'), {
        engine: {
            ejs: require('ejs')
        },
        root: path.join(__dirname, 'src/views'),
        layout: 'layouts/default.ejs'
    });


    let database = null;

    if (process.env.DB_DRIVER === 'pg') {
        database = require('./src/database/pg');
    }

    try {
        await database.connect();
        variableManager.reload(database);
        pex.reload(database);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    fastify.decorate('database', database);

    routes(fastify);

    fastify.listen(PORT, err => {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
        else
            console.log('Server running on port ' + PORT);
    });


})();
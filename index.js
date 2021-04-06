const fastify = require('fastify');
const fs = require('fs');
const path = require('path');
const routes = require('./src/routes/routes');
const port = process.env.PORT || 3000;
const db = require('./src/database/db');

db.init().then(() => {
    const variableManager = require('./src/util/variableManager');
    variableManager.reload();
});

let app = fastify({logger: false});

app.register(require('fastify-formbody'));

app.register(require('fastify-secure-session'), {
    cookieName: 'voidbb',

    key: fs.readFileSync(path.join(__dirname, 'secret-key')),
    cookie: {
        path: '/'
    }
});


app.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/'
});

app.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    },
    root: path.join(__dirname, 'src/views'),
    layout: 'layouts/default.ejs'
});


app.addHook('onRequest', (request, reply, done) => {
    const auth = request.session.get('username');
    if(auth) {
        request.isAuth = true;
        request.authUsername = auth;
    } else {
        request.isAuth = false;
    }
    done();
});

routes(app);

app.listen(port, err => {
    if(err)
        console.log(err.message);
    console.log('Server running on port ' + port);
});

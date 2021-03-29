const fastify = require('fastify');
const path = require('path');
const routes = require('./src/routes/routes');
const port = process.env.PORT || 3000;

let app = fastify({logger: true});

app.register(require('fastify-formbody'));

app.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    },
    root: path.join(__dirname, 'src/views'),
    layout: 'layouts/main.ejs'
});

routes(app);

app.listen(port, err => {
    if(err)
        console.log(err.message);
    console.log('Server running on port ' + port);
});

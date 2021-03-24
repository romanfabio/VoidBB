const fastify = require('fastify');
const mongoose = require('mongoose');
const path = require('path');
const port = process.env.PORT || 3000;

let app = fastify({logger: true});

mongoose.connect('mongodb://localhost:27017/voidbb', {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(err));

app.register(require('fastify-formbody'));

app.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    },
    root: path.join(__dirname, '/views'),
    layout: 'layouts/main.ejs'
});

app.register(require('./routes/main.routes'));

app.listen(port, err => {
    if(err)
        console.log(err.message);
    console.log('Server running on port ' + port);
});

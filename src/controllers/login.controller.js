const db = require('../config/db');
const bcrypt = require('bcrypt');
const fieldValidator = require('../util/authenticationFieldValidator');

module.exports = {
    get: (request, reply) => {
        reply.view('login.ejs', {title: 'Login'});
    },

    post: (request, reply) => {
        const data = request.body;
        data.username = validator.trim(data.username);
        data.password = validator.trim(data.password);
        
        
    }
}
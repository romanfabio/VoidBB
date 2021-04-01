const db = require('../database/db');
const bcrypt = require('bcrypt');
const fieldValidator = require('../util/fieldValidator');
const validator = require('validator');
const { Op } = require('sequelize');

module.exports = {
    get: (request, reply) => {
        if(request.isAuth)
            reply.redirect('/');
        else
            reply.view('login.ejs', {title: 'Login'});
    },

    post: (request, reply) => {
        if(request.isAuth) {
            reply.redirect('/');
            return;
        }

        const data = request.body;
        data.username = validator.trim(data.username);
        data.password = validator.trim(data.password);

        const UserModel = db.getUserModel();

        UserModel.findAll({
            attributes: ['password'],
            where: {
                username: {
                    [Op.eq]: data.username
                }
            }
        }).then((value) => {
            if(value.length == 1) {
                bcrypt.compare(data.password, value[0].password, (err, result) => {
                    if(err) {
                        request.log.info(err);
                        reply.view('login.ejs', {title: 'Login', error: 'An error has occured, retry later'});
                    } else {
                        if(result) {
                            request.session.set('username', data.username);
                            reply.redirect('/');
                        } else {
                            reply.view('login.ejs', {title: 'Login', error: 'Username and/or password invalid'});
                        }
                    }
                });
            } else {
                reply.view('login.ejs', {title: 'Login', error: 'Username and/or password invalid'});
            }
        }, (err) => {
            request.log.info(err);
            reply.view('login.ejs', {title: 'Login', error: 'An error has occured, retry later'});
        });
        
    }
}
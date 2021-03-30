const { Sequelize } = require('sequelize');
const UserModel = require('../models/user');

const sequelize = new Sequelize('postgres://voidbbuser:voidbbuser@localhost:5432/voidbb');

module.exports = {
    init: async () => {

        try {
            await sequelize.authenticate();
            console.log("[ OK ] Database");
        } catch(err) {
            console.log("Can't connect to database");
        }
    
        await UserModel(sequelize);
    },
    getUserModel: () => {
        return sequelize.models.User;
    } 
}   
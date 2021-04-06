const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const User = sequelize.define('User', {
        username: { 
            type: DataTypes.STRING(64),
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        permission: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: '00000000000000000000000000000000'
        }
    },
    {
        timestamps: false
    });

    await User.sync({force: true});
}
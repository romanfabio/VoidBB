const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const User = sequelize.define('User', {
        username: { 
            type: DataTypes.STRING(32),
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
        }
    },
    {
        timestamps: false
    });

    await User.sync();
}
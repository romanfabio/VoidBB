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
        global_group: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: sequelize.models.Global_Group,
                key: 'id'
            }
        }
    },
    {
        timestamps: false
    });

    await User.sync();
}
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Variable = sequelize.define('Variable', {
        key: {
            type: DataTypes.STRING(32),
            allowNull: false,
            primaryKey: true
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        isInt: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: false
    });

    await Variable.sync();
}
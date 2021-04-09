const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const GlobalGroup = sequelize.define('GlobalGroup', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        mask: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    await GlobalGroup.sync();
}
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const GlobalGroup = sequelize.define('Global_Group', {
        id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: true
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
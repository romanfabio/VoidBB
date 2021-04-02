const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Forum = sequelize.define('Forum', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    await Forum.sync({force: true});
}
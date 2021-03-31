const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Topic = sequelize.define('Topic', {
        id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        creator: {
            type: DataTypes.STRING(32),
            allowNull: false,
            references: {
                model: sequelize.models.User,
                key: 'username'
            }
        },
        upload_timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    await Topic.sync();
}
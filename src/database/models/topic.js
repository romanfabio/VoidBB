const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Topic = sequelize.define('Topic', {
        id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        forum_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: sequelize.models.Forum,
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    await Topic.sync();
}
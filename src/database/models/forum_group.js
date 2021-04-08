const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const ForumGroup = sequelize.define('Forum_Group', {
        id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        forum_name: {
            type: DataTypes.STRING(64),
            allowNull: false,
            references: {
                model: sequelize.models.Forum,
                key: 'name'
            }
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
        timestamps: false,
        indexes: [{ unique: true, fields: ['forum_name','name'] }]
    });

    await ForumGroup.sync();
}
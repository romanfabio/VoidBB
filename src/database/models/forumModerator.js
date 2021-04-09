const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const ForumModerator = sequelize.define('ForumModerator', {
        username: { 
            type: DataTypes.STRING(32),
            allowNull: false,
            primaryKey: true,
            references: {
                model: sequelize.models.User,
                key: 'username'
            }
        },
        forum_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            primaryKey: true,
            references: {
                model: sequelize.models.Forum,
                key: 'name'
            }
        }
    },
    {
        timestamps: false
    });

    await ForumModerator.sync();
}
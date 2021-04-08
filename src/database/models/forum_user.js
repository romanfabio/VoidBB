const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const ForumUser = sequelize.define('Forum_User', {
        username: { 
            type: DataTypes.STRING(64),
            allowNull: false,
            primaryKey: true,
            references: {
                model: sequelize.models.User,
                key: 'username'
            }
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: sequelize.models.Forum_Group,
                key: 'id'
            }
        }
    },
    {
        timestamps: false
    });

    await ForumUser.sync();
}
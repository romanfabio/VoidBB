const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Post = sequelize.define('Post', {
        id: { 
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        forum_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            references: {
                model: sequelize.models.Forum,
                key: 'name'
            }
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
            allowNull: true,
            references: {
                model: sequelize.models.User,
                key: 'username'
            }
        },
        created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    await Post.sync();
}
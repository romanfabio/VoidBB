const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Post = sequelize.define('Post', {
        id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: sequelize.models.Topic,
                key: 'id'
            }
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

    await Post.sync({force: true});
}
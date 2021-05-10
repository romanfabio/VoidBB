const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Comment = sequelize.define('Comment', {
        id: { 
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: sequelize.models.Post,
                key: 'id'
            }
        },
        reply: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            references: {
                model: "Comments",
                key: 'id'
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        creator: {
            type: DataTypes.STRING(32),
            allowNull: true,
            defaultValue: null,
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

    await Comment.sync();
}
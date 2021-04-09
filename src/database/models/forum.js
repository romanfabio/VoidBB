const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    const Forum = sequelize.define('Forum', {
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING(255),
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
        user_mask: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        moderator_mask: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    await Forum.sync();
}
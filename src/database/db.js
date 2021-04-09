const { Sequelize } = require('sequelize');
const VariableModel = require('./models/variable');
const GlobalGroupModel = require('./models/globalGroup');
const UserModel = require('./models/user');
const ForumModel = require('./models/forum');
const ForumModerator = require('./models/forumModerator');
const PostModel = require('./models/post');

const sequelize = new Sequelize('postgres://voidbbuser:voidbbuser@localhost:5432/voidbb');

module.exports = {
    init: async () => {

        await sequelize.authenticate()
            .then(() => VariableModel(sequelize))
            .then(() => GlobalGroupModel(sequelize))
            .then(() => UserModel(sequelize))
            .then(() => ForumModel(sequelize))
            .then(() => ForumModerator(sequelize))
            .then(() => PostModel(sequelize))
            .catch((err) => {
                console.log('Can\'t initialize database\'s models');
                console.log(err);
            });
    },
    generateTransaction: () => {
        return sequelize.transaction();
    },
    getVariableModel: () => sequelize.models.Variable,

    getGlobalGroupModel: () => sequelize.models.GlobalGroup,

    getUserModel: () => sequelize.models.User,

    getForumModel: () => sequelize.models.Forum,

    getForumModeratorModel: () => sequelize.models.ForumModerator,

    getPostModel: () => sequelize.models.Post

};
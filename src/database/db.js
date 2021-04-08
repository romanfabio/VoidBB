const { Sequelize } = require('sequelize');
const UserModel = require('./models/user');
const TopicModel = require('./models/topic');
const ForumModel = require('./models/forum');
const PostModel = require('./models/post');
const VariableModel = require('./models/variable');
const GlobalGroupModel = require('./models/global_group');
const ForumGroupModel = require('./models/forum_group');
const ForumUserModel = require('./models/forum_user');

const sequelize = new Sequelize('postgres://voidbbuser:voidbbuser@localhost:5432/voidbb');

module.exports = {
    init: async () => {

        await sequelize.authenticate()
            .then(() => VariableModel(sequelize))
            .then(() => GlobalGroupModel(sequelize))
            .then(() => UserModel(sequelize))
            .then(() => ForumModel(sequelize))
            .then(() => ForumGroupModel(sequelize))
            .then(() => ForumUserModel(sequelize))
            .then(() => TopicModel(sequelize))
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

    getUserModel: () => sequelize.models.User,

    getTopicModel: () => sequelize.models.Topic,

    getForumModel: () => sequelize.models.Forum,

    getPostModel: () => sequelize.models.Post,

    getGlobalGroupModel: () => sequelize.models.Global_Group,

    getForumGroupModel: () => sequelize.models.Forum_Group,

    getForumUserModel: () => sequelize.models.Forum_User
}   
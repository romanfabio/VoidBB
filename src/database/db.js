const { Sequelize } = require('sequelize');
const UserModel = require('./models/user');
const TopicModel = require('./models/topic');
const ForumModel = require('./models/forum');
const PostModel = require('./models/post');

const sequelize = new Sequelize('postgres://voidbbuser:voidbbuser@localhost:5432/voidbb');

module.exports = {
    init: () => {
        
        sequelize.authenticate()
            .then(() => UserModel(sequelize))
            .then(() => ForumModel(sequelize))
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
    getUserModel: () => {
        return sequelize.models.User;
    },
    getTopicModel: () => {
        return sequelize.models.Topic;
    },
    getForumModel: () => {
        return sequelize.models.Forum;
    },
    getPostModel: () => {
        return sequelize.models.Post;
    }
}   
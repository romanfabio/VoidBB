const { Sequelize } = require('sequelize');
const UserModel = require('./models/user');
const TopicModel = require('./models/topic');
const ForumModel = require('./models/forum');
const PostModel = require('./models/post');

const sequelize = new Sequelize('postgres://voidbbuser:voidbbuser@localhost:5432/voidbb');

module.exports = {
    init: async () => {

        try {
            await sequelize.authenticate();
            console.log("[ OK ] Database");
        } catch(err) {
            console.log("Can't connect to database");
        }
    
        await UserModel(sequelize);
        await ForumModel(sequelize);
        await TopicModel(sequelize);
        await PostModel(sequelize);
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
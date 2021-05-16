const pg = require('pg');

const TABLE_VARIABLES = 'CREATE TABLE Variables (key VARCHAR(32) NOT NULL, value VARCHAR(255), isInt BOOLEAN NOT NULL DEFAULT false, PRIMARY KEY(key))';
const TABLE_GLOBAL_GROUPS = 'CREATE TABLE GlobalGroups (id INTEGER NOT NULL, name VARCHAR(32) NOT NULL, mask VARCHAR(255) NOT NULL, PRIMARY KEY(id))';
const TABLE_USERS = 'CREATE TABLE Users (username VARCHAR(32) NOT NULL, password VARCHAR(60) NOT NULL, email VARCHAR(128) NOT NULL, globalGroup INTEGER NOT NULL REFERENCES GlobalGroups(id), PRIMARY KEY(username))';
const TABLE_FORUMS = 'CREATE TABLE Forums (name VARCHAR(32) NOT NULL, description VARCHAR(255) NOT NULL, creator VARCHAR(32) NOT NULL REFERENCES Users(username), userMask VARCHAR(255) NOT NULL, moderatorMask VARCHAR(255) NOT NULL, PRIMARY KEY(name))';
const TABLE_FORUM_MODERATORS = 'CREATE TABLE ForumModerators (username VARCHAR(32) NOT NULL REFERENCES Users(username), forumName VARCHAR(32) NOT NULL REFERENCES Forums(name), PRIMARY KEY(username, forumName))';
const TABLE_POSTS = 'CREATE TABLE Posts (id BIGSERIAL NOT NULL, forumName VARCHAR(32) NOT NULL REFERENCES Forums(name), title VARCHAR(255) NOT NULL, description TEXT NOT NULL, creator VARCHAR(32) REFERENCES Users(username), created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), PRIMARY KEY(id))';
const TABLE_COMMENTS = 'CREATE TABLE Comments (id BIGSERIAL NOT NULL, postId BIGINT NOT NULL REFERENCES Posts(id), reply BIGINT REFERENCES Comments(id), description TEXT NOT NULL, creator VARCHAR(32) REFERENCES Users(username), created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), PRIMARY KEY(id))';

const client = new pg.Client({
    user: 'voidbbuser',
    host: 'localhost',
    database: 'voidbb',
    password: 'voidbbuser',
    port: 5432,
});

let methods = {
    connect: async () => {
        await client.connect();
    },

    create: async () => {
        /*await client.query(TABLE_VARIABLES);
        await client.query(TABLE_GLOBAL_GROUPS);
        await client.query(TABLE_USERS);
        await client.query(TABLE_FORUMS);
        await client.query(TABLE_FORUM_MODERATORS);
        await client.query(TABLE_POSTS);
        await client.query(TABLE_COMMENTS);*/
    },

    findAllVariables: async () => {
        const result = await client.query('SELECT * FROM Variables');

        return result.rows;
    }
};

methods.connect().then(() => {
    return methods.create()
}).then(() => {
    return methods.findAllVariables();
}).then((data) => {console.log(data)}).catch((err) => {
    console.log('Error');
    console.error(err);
})
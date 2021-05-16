const pg = require('pg');
const cache = require('../util/cache');

const TABLE_VARIABLES = 'CREATE TABLE "Variables" ("key" VARCHAR(32) NOT NULL, "value" VARCHAR(255), "isInt" BOOLEAN NOT NULL DEFAULT false, PRIMARY KEY("key"))';
const TABLE_GLOBAL_GROUPS = 'CREATE TABLE "GlobalGroups" ("id" INTEGER NOT NULL, "name" VARCHAR(32) NOT NULL, "mask" VARCHAR(255) NOT NULL, PRIMARY KEY("id"))';
const TABLE_USERS = 'CREATE TABLE "Users" ("username" VARCHAR(32) NOT NULL, "password" VARCHAR(60) NOT NULL, "email" VARCHAR(128) NOT NULL, "globalGroup" INTEGER NOT NULL REFERENCES "GlobalGroups"("id"), PRIMARY KEY("username"))';
const TABLE_FORUMS = 'CREATE TABLE "Forums" ("name" VARCHAR(32) NOT NULL, "description" VARCHAR(255) NOT NULL, "creator" VARCHAR(32) NOT NULL REFERENCES "Users"("username"), "userMask" VARCHAR(255) NOT NULL, "moderatorMask" VARCHAR(255) NOT NULL, PRIMARY KEY("name"))';
const TABLE_FORUM_MODERATORS = 'CREATE TABLE "ForumModerators" ("username" VARCHAR(32) NOT NULL REFERENCES "Users"("username"), "forumName" VARCHAR(32) NOT NULL REFERENCES "Forums"("name"), PRIMARY KEY("username", "forumName"))';
const TABLE_POSTS = 'CREATE TABLE "Posts" ("id" BIGSERIAL NOT NULL, "forumName" VARCHAR(32) NOT NULL REFERENCES "Forums"("name"), "title" VARCHAR(255) NOT NULL, "description" TEXT NOT NULL, "creator" VARCHAR(32) REFERENCES "Users"("username"), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), PRIMARY KEY("id"))';
const TABLE_COMMENTS = 'CREATE TABLE "Comments" ("id" BIGSERIAL NOT NULL, "postId" BIGINT NOT NULL REFERENCES "Posts"("id"), "reply" BIGINT REFERENCES "Comments"("id"), "description" TEXT NOT NULL, "creator" VARCHAR(32) REFERENCES "Users"("username"), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), PRIMARY KEY("id"))';

const client = new pg.Client({
    user: 'voidbbuser',
    host: 'localhost',
    database: 'voidbb',
    password: 'voidbbuser',
    port: 5432,
});

module.exports = {
    connect: async () => {
        await client.connect();
    },

    create: async () => {
        await client.query(TABLE_VARIABLES);
        await client.query(TABLE_GLOBAL_GROUPS);
        await client.query(TABLE_USERS);
        await client.query(TABLE_FORUMS);
        await client.query(TABLE_FORUM_MODERATORS);
        await client.query(TABLE_POSTS);
        await client.query(TABLE_COMMENTS);
    },

    findAllVariables: async () => {
        const result = await client.query('SELECT * FROM "Variables"');
        return result.rows;
    },

    findAllForums: async () => {
        const result = await client.query('SELECT * FROM "Forums"');
        return result.rows;
    },

    find_Id_Mask_Of_GlobalGroups_OrderBy_Id_Asc: async () => {
        const result = await client.query('SELECT "id", "mask" FROM "GlobalGroups" ORDER BY "id" ASC');
        return result.rows;
    },

    find_GlobalGroup_Of_Users_By_Username: async (username) => {
        let group = cache.globalGroup(username);

        if(group)
            return {globalGroup: group};
        else {
            group = await client.query('SELECT "globalGroup" FROM "Users" WHERE "username" = $1', [username]);

            if(group.rows.length === 1) {
                cache.invalidateGlobalGroup(username, group.rows[0].globalGroup);
                console.log(group.rows[0].globalGroup);
                return group.rows[0];
            } else {
                return null;
            }
        }
    },

    update_Value_Of_Variables_By_Key: async (key, value) => {
        await client.query('UPDATE "Variables" SET "value" = $1 WHERE "key" = $2', [value, key]);
    },

    find_Password_Of_Users_By_Username: async (username) => {
        const result = await client.query('SELECT "password" FROM "Users" WHERE "username" = $1', [username]);
        return (result.rows.length!==1?null:result.rows[0]);
    },

    insertForum: async (name,description,creator,usermask,moderatormask) => {
        await client.query('INSERT INTO "Forums" ("name","description","creator","userMask","moderatorMask") VALUES ($1,$2,$3,$4,$5)',
            [name,description,creator,usermask,moderatormask]);
    },

    find_Creator_UMask_MMask_Of_Forums_By_Name: async (name) => {
        let forum = cache.forum(name);

        if(forum) {
            return forum;
        } else {
            forum = await client.query('SELECT "creator", "userMask", "moderatorMask" FROM "Forums" WHERE "name" = $1', [name]);

            if(forum.rows.length === 1) {
                return forum.rows[0];
            } else {
                return null;
            }
        }
    },

    find_ForumModerators_By_Username_ForumName: async (username, forumName) => {
        const result = await client.query('SELECT * FROM "ForumModerators" WHERE "username" = $1 AND "forumName" = $2',
            [username, forumName]);
        return (result.rows.length!==1?null:result.rows[0]);
    },

    insertPost: async (forumName, title, description, creator) => {
        await client.query('INSERT INTO "Posts" ("forumName","title","description","creator") VALUES ($1,$2,$3,$4)',
            [forumName,title,description,creator]);
    },

    insertUser: async (username, password, email, globalGroup) => {
        await client.query('INSERT INTO "Users" ("username", "password", "email", "globalGroup") VALUES ($1,$2,$3,$4)',
            [username, password, email, globalGroup]);
    },

    find_Forum_By_Name: async (name) => {
        const result = await client.query('SELECT * FROM "Forums" WHERE "name" = $1', [name]);
        return (result.rows.length!==1?null:result.rows[0]);
    },

    findAllPosts_By_ForumName: async (forumName) => {
        const result = await client.query('SELECT * FROM "Posts" WHERE "forumName" = $1', [forumName]);
        return result.rows;
    },

    find_Email_Of_User_By_Username: async (username) => {
        //NO password FIELD
        const result = await client.query('SELECT "email" FROM "Users" WHERE "username" = $1', [username]);
        return (result.rows.length!==1?null:result.rows[0]);
    },

    find_Post_By_Id: async (id) => {
        const result = await client.query('SELECT * FROM "Posts" WHERE "id" = $1', [id]);
        return (result.rows.length!==1?null:result.rows[0]);
    },

    findAllComments_By_PostId: async (postId) => {
        const result = await client.query('SELECT * FROM "Comments" WHERE "postId" = $1', [postId]);
        return result.rows;
    },

    insertComment: async (postId, reply, description, creator) => {
        await client.query('INSERT INTO "Comments" ("postId","reply","description","creator") VALUES ($1,$2,$3,$4)',
            [postId,reply,description,creator]);
    }
};
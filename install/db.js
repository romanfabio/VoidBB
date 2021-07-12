const TABLE_VARIABLES = 'CREATE TABLE "Variables" ("key" VARCHAR(32) NOT NULL, "value" VARCHAR(255), "isInt" BOOLEAN NOT NULL DEFAULT false, PRIMARY KEY("key"))';
const TABLE_GLOBAL_GROUPS = 'CREATE TABLE "GlobalGroups" ("id" INTEGER NOT NULL, "name" VARCHAR(32) NOT NULL, "mask" VARCHAR(255) NOT NULL, PRIMARY KEY("id"))';
const TABLE_USERS = 'CREATE TABLE "Users" ("username" VARCHAR(32) NOT NULL, "password" VARCHAR(60) NOT NULL, "email" VARCHAR(128) NOT NULL, "globalGroup" INTEGER NOT NULL REFERENCES "GlobalGroups"("id"), PRIMARY KEY("username"))';
const TABLE_FORUMS = 'CREATE TABLE "Forums" ("name" VARCHAR(32) NOT NULL, "description" VARCHAR(255) NOT NULL, "creator" VARCHAR(32) NOT NULL REFERENCES "Users"("username"), "userMask" VARCHAR(255) NOT NULL, "moderatorMask" VARCHAR(255) NOT NULL, PRIMARY KEY("name"))';
const TABLE_FORUM_MODERATORS = 'CREATE TABLE "ForumModerators" ("username" VARCHAR(32) NOT NULL REFERENCES "Users"("username"), "forumName" VARCHAR(32) NOT NULL REFERENCES "Forums"("name"), PRIMARY KEY("username", "forumName"))';
const TABLE_POSTS = 'CREATE TABLE "Posts" ("id" BIGSERIAL NOT NULL, "forumName" VARCHAR(32) NOT NULL REFERENCES "Forums"("name"), "title" VARCHAR(255) NOT NULL, "description" TEXT NOT NULL, "creator" VARCHAR(32) REFERENCES "Users"("username"), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), PRIMARY KEY("id"))';
const TABLE_COMMENTS = 'CREATE TABLE "Comments" ("id" BIGSERIAL NOT NULL, "postId" BIGINT NOT NULL REFERENCES "Posts"("id"), "reply" BIGINT REFERENCES "Comments"("id"), "description" TEXT NOT NULL, "creator" VARCHAR(32) REFERENCES "Users"("username"), "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), PRIMARY KEY("id"))';



module.exports = {
    connect: async (params) => {
        switch (params.driver) {
            case 'pg':
            case 'mysql':
                break;
            default:
                console.log('Unknown driver');
                process.exit(1);
        }
    
        const knex = require('knex')({
            debug: true,
            client: params.driver,
            connection: {
                host : params.host,
                user : params.user,
                password : params.pass,
                database : params.name,
                port: params.port
            }
        });
    
        await knex.select(2);

        return knex;
    },

    createTables: async (db) => {

        await db.schema.createTable('Variables', function(table) {
            table.string('key', 32).notNullable().primary();
            table.string('value', 255);
            table.boolean('isInt').notNullable().defaultTo(false);
        });

        await db.schema.createTable('GlobalGroups', function(table) {
            table.integer('id').notNullable().primary();
            table.string('name', 32).notNullable();
            table.string('mask', 255).notNullable();
        });

        await db.schema.createTable('Users', function(table) {
            table.string('username', 32).notNullable().primary();
            table.string('password', 60).notNullable();
            table.string('email', 128).notNullable();
            table.integer('globalGroup').notNullable();
            table.foreign('globalGroup').references('GlobalGroups.id');
        });

        await db.schema.createTable('Forums', function(table) {
            table.string('name', 32).notNullable().primary();
            table.string('description', 255).notNullable();
            table.string('creator', 32).notNullable();
            table.string('pexMask', 255).notNullable();

            table.foreign('creator').references('Users.username');
        });
        
        await db.schema.createTable('ForumModerators', function(table) {
            table.string('username', 32).notNullable();
            table.string('forumName', 32).notNullable();

            table.foreign('username').references('Users.username');
            table.foreign('forumName').references('Forums.name');

            table.primary(['username','forumName']);
        });

        await db.schema.createTable('Posts', function(table) {
            table.bigIncrements('id').notNullable();
            table.string('forumName', 32).notNullable();
            table.string('title', 255).notNullable();
            table.text('description').notNullable();
            table.string('creator', 32);
            table.timestamp('created').notNullable().defaultTo(db.fn.now());

            table.foreign('forumName').references('Forums.name');
            table.foreign('creator').references('Users.username');
        });

        await db.schema.createTable('Comments', function(table) {
            table.bigIncrements('id').notNullable();
            table.bigInteger('postId').notNullable();
            table.bigInteger('reply');
            table.text('description').notNullable();
            table.string('creator', 32);

            table.foreign('postId').references('Posts.id');
            table.foreign('reply').references('Comments.id');
            table.foreign('creator').references('Users.username');

            table.timestamp('created').notNullable().defaultTo(db.fn.now());
        });

    },
    

    populate: async (db, boardName, fUsername, fPassword, fEmail) => {
        await db('GlobalGroups').insert([
            {id: 0, name: 'Anonymous', mask: '110100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'},
            {id: 1, name: 'User', mask: '110100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'},
            {id: 2, name: 'Moderator', mask: '110100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'},
            {id: 3, name: 'Admin', mask: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'}
        ]);

        await db('Variables').insert([
            {key: 'BOARD_NAME', isInt: false, value: boardName},
            {key: 'FOUNDER_NAME', isInt: false, value: fUsername},
            {key: 'FOUNDER_EMAIL', isInt: false, value: fEmail},
            {key: 'PASSWORD_MIN_LENGTH', isInt: true, value: '8'},
            {key: 'PASSWORD_MAX_LENGTH', isInt: true, value: '64'},
            {key: 'USERNAME_MIN_LENGTH', isInt: true, value: '4'},
            {key: 'USERNAME_MAX_LENGTH', isInt: true, value: '32'},
            {key: 'FORUM_NAME_MAX_LENGTH', isInt: true, value: '32'},
            {key: 'FORUM_DESCRIPTION_MAX_LENGTH', isInt: true, value: '255'},
            {key: 'POST_TITLE_MAX_LENGTH', isInt: true, value: '255'}
        ]);

        await db('Users').insert([{username: fUsername, password: fPassword, email: fEmail, globalGroup: 3}]);
    }


}
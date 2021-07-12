CREATE TABLE Variables (
    key VARCHAR(32) NOT NULL,
    value VARCHAR(255),
    isInt BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY(key)    
);

CREATE TABLE GlobalGroups (
    id INTEGER NOT NULL,
    name VARCHAR(32) NOT NULL,
    mask VARCHAR(255) NOT NULL,

    PRIMARY KEY(id)
);

CREATE TABLE Users (
    username VARCHAR(32) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(128) NOT NULL,
    globalGroup INTEGER NOT NULL REFERENCES GlobalGroups(id),

    PRIMARY KEY(username)
);

CREATE TABLE Forums (
    name VARCHAR(32) NOT NULL,
    description VARCHAR(255) NOT NULL,
    creator VARCHAR(32) NOT NULL REFERENCES Users(username),
    pexMask VARCHAR(255) NOT NULL,

    PRIMARY KEY(name)
);

CREATE TABLE ForumModerators (
    username VARCHAR(32) NOT NULL REFERENCES Users(username),
    forumName VARCHAR(32) NOT NULL REFERENCES Forums(name),

    PRIMARY KEY(username, forumName)
);

CREATE TABLE Posts (
    id BIGSERIAL NOT NULL,
    forumName VARCHAR(32) NOT NULL REFERENCES Forums(name),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    creator VARCHAR(32) REFERENCES Users(username),
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id)
);

CREATE TABLE Comments (
    id BIGSERIAL NOT NULL,
    postId BIGINT NOT NULL REFERENCES Posts(id),
    reply BIGINT REFERENCES Comments(id),
    description TEXT NOT NULL,
    creator VARCHAR(32) REFERENCES Users(username),
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY(id)
);
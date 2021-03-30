create table users (
    username varchar(32) not null,
    password varchar(60) not null,
    email varchar(64) not null,
    primary key(username)
);
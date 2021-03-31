create table users (
    username varchar(32) not null,
    password varchar(60) not null,
    email varchar(64) not null,
    primary key(username)
);

create table topics (
    id serial not null,
    title varchar(255) not null,
    description text not null,
    creator varchar(32) not null,
    upload_timestamp timestamp not null default NOW(),

    primary key(id),
    foreign key(creator) references "Users"(username)
);
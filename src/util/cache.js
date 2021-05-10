const global_group = new Map(); // Key => username;  // Value => global group id

const forum = new Map(); // Key => forum's name;    // Value => {creator, user_mask, moderator_mask}

module.exports = {

    global_group: (username) => {
        return global_group.get(username);
    },

    invalidate_global_group: (username, value) => {
        if(username) {
            if(value)
                global_group.set(username, value);
            else
                global_group.delete(username);
        }
        else
            global_group.clear();
    },

    forum: (forum_name) => {
        return forum.get(forum_name);
    },

    invalidate_forum: (forum_name, value) => {
        if(forum_name) {
            if(value)
                forum.set(forum_name, value);
            else
                forum.delete(forum_name);
        }
        else
            forum.clear();
    }

};
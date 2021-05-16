const globalGroup = new Map(); // Key => username;  // Value => global group id

const forum = new Map(); // Key => forum's name;    // Value => {creator, user_mask, moderator_mask}

module.exports = {

    globalGroup: (username) => {
        return globalGroup.get(username);
    },

    invalidateGlobalGroup: (username, value) => {
        if(username) {
            if(value)
                globalGroup.set(username, value);
            else
                globalGroup.delete(username);
        }
        else
            globalGroup.clear();
    },

    forum: (forumName) => {
        return forum.get(forumName);
    },

    invalidateForum: (forumName, value) => {
        if(forumName) {
            if(value)
                forum.set(forumName, value);
            else
                forum.delete(forumName);
        }
        else
            forum.clear();
    }

};
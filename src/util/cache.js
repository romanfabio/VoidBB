const global_group = new Map(); // Key => username;  // Value => global group id

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

};
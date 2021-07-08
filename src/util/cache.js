let database;

const MAX_SIZE = 100;

const globalGroup = new Map(); // Key => username;  // Value => global group id
const forumModerator = new Map(); // Key => (username-forumName);   // Value => boolean

module.exports = {

    init: (db) => {database = db;},

    gGroup: async function (username) {
        let groupId = globalGroup.get(username);
        if(groupId === undefined) {
            groupId = await database.select('globalGroup').from('Users').where('username', username);
            if(groupId.length === 1) {
                groupId = groupId[0].globalGroup;
                this.gGroupSet(username, groupId);
            }
            else
                groupId = undefined;
        }
        return groupId;
    },

    gGroupSet: function (username, groupId) { 
        if(globalGroup.size >= MAX_SIZE)
            globalGroup.delete( Array.from(globalGroup.keys())[0] )
        globalGroup.set(username, groupId); 
    },

    gGroupDel: function (username) {
        if(username)
            globalGroup.delete(username);
        else
            globalGroup.clear();
    },


    fMod: async function (username, fName) {
        let isMod = forumModerator.get(username + '-' + fName);
        if(isMod === undefined) {
            isMod = await database.select('*').from('ForumModerators').where('username',username).andWhere('forumName', fName);
            if(isMod.length === 1)
                isMod = true;
            else
                isMod = false;

            this.fModSet(username + '-' + fName, isMod);
        }
        return isMod;
    },

    fModSet: function (usernameFName, isMod) {
        if(forumModerator.size >= MAX_SIZE)
            forumModerator.delete( Array.from(forumModerator.keys())[0] )
        forumModerator.set(usernameFName, isMod); 
    },

    fModDel: function (usernameFName) {
        if(usernameFName)
            forumModerator.delete(usernameFName);
        else
            forumModerator.clear();
    }

};
const db = require('../database/db');

const globalGroupMasks = new Map();

module.exports = {
    reload: () => {
        const globalGroupModel = db.getGlobalGroupModel();

        globalGroupModel.findAll().then((value) => {
            globalGroupMasks.clear();
            for(let i = 0; i < value.length; i++) {
                console.log(value[i].id + " " + value[i].name + " " + value[i].mask);

                globalGroupMasks.set(value[i].id, value[i].mask);
            }
        }, (err) => {
            console.log('Can\'t reload global permissions');
            console.log(err);
        });
    },

    defaultGlobalGroup: {
        Anonymous: 1,
        Registered_User: 2,
        Moderator: 3,
        Administrator: 4
    },

    globalBit: {
        REGISTER: 0,
        CREATE_FORUM: 1,
        DELETE_FORUM: 2
    },

    globalExists: (group_id) => globalGroupMasks.has(group_id),

    isGlobalSet: (group_id, bit) => globalGroupMasks.get(group_id)[bit] == '1',

}
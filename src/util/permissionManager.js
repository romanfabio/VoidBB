const db = require('../database/db');

const globalMasks = new Map();

module.exports = {
    reload: () => {
        const globalGroupModel = db.getGlobalGroupModel();

        globalGroupModel.findAll({attributes: ['id','mask'], order: [['id','ASC']]}).then((groups) => {
            if(groups.length === 4) {
                globalMasks.clear();
                for(let i = 0; i < groups.length; i++) {
                    globalMasks.set(groups[i].id, groups[i].mask);
                }
            } else {
                console.log('Can\'t reload global permissions: Global group quantity is not 4');
            }
        }, (err) => {
            console.log('Can\'t reload global permissions');
            console.log(err);
        });
    },

    GLOBAL_ANONYMOUS: 0,
    GLOBAL_USER: 1,
    GLOBAL_MODERATOR: 2,
    GLOBAL_ADMIN: 3,

    globalBit: {
        REGISTER: 0,
        VIEW_FORUM: 1,
        CREATE_FORUM: 2,
        VIEW_USER: 3
    },

    isGlobalSet: (group_id, bit) => {
        return globalMasks.get(group_id)[bit] == '1';
    },

    forumBit: {
        ANONYMOUS_POST: 0,
        CREATE_POST: 1,
        DELETE_OWN_POST: 2,
        ANONYMOUS_COMMENT: 3,
        CREATE_COMMENT: 4,
        DELETE_OWN_COMMENT: 5
    }

}
const globalMasks = new Map();

module.exports = {
    reload: async (database) => {

        const groups = await database.find_Id_Mask_Of_GlobalGroups_OrderBy_Id_Asc();

        if (groups.length === 4) {
            globalMasks.clear();
            for (let i = 0; i < groups.length; i++) {
                globalMasks.set(groups[i].id, groups[i].mask);
            }
        } else {
            throw new Error('Can\'t reload global permissions: Global group quantity is not 4');
        }
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

    isGlobalSet: (groupId, bit) => {
        return globalMasks.get(groupId)[bit] == '1';
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
const pex = require('../util/permissionManager');

module.exports = {
    get: async function(request, reply) {

        const viewArgs = request.viewArgs;
        viewArgs.styles = ['preview-list.css'];

        if(pex.isGlobalSet(request.user.globalGroup, pex.globalBit.CREATE_FORUM))
            viewArgs.canCreateForum = true;

        try {
            const forums = await this.database.findAllForums();

            viewArgs.forums = forums;
        } catch(e) {
            console.error(e);
            viewArgs.ERROR = 'An error has occured, retry later';
        }

        reply.view('home.ejs', viewArgs);
    }
};
const variable = require('../util/variableManager');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');

module.exports = {
    get: async function (request, reply) {
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
        } else {

            if(request.user.ap) {
                viewArgs.TOKEN = await reply.generateCsrf();
                request.viewArgs.boardName = variable.get('BOARD_NAME');
                reply.view('apGeneral.ejs', request.viewArgs);
            } else {
                reply.redirect('/ap');
            }
        }
    },

    post: async function (request, reply) {

        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
            return;
        }

        if(! request.user.ap) {
            reply.redirect('/ap');
            return;
        }

        const data = request.body;

        data.boardName = data.boardName.trim();

        if(data.boardName === variable.get('BOARD_NAME')) {
            request.flash('info','Settings saved');
            reply.redirect('/ap/general');
            return;
        }

        if(!validator.isBoardName(data.boardName)) {
            request.flash('error','Invalid Board Name');
            reply.redirect('/ap/general');
            return;
        }


        try {
            await this.database('Variables').where('key', 'BOARD_NAME').update({value: data.boardName});

            await variable.reload(this.database);

            request.flash('info','Settings saved');
            reply.redirect('/ap/general');

        } catch(e) {
            console.error(e);

            request.flash('error','An error has occured, retry later');
            reply.redirect('/ap/general');
        }

    }
}
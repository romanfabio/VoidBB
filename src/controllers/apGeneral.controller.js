const variable = require('../util/variableManager');
const validator = require('../util/validator');
const pex = require('../util/permissionManager');

module.exports = {
    get: function (request, reply) {
        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
        } else {
            request.viewArgs.boardName = variable.get('BOARD_NAME');
            reply.view('apGeneral.ejs', request.viewArgs);
        }
    },

    post: async function (request, reply) {

        if(request.user.globalGroup !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
            return;
        }
        
        const viewArgs = request.viewArgs;
        viewArgs.boardName = variable.get('BOARD_NAME');

        const data = request.body;

        data.boardName = data.boardName.trim();

        if(data.boardName === variable.get('BOARD_NAME')) {
            viewArgs.INFO = 'Settings saved';
            reply.view('apGeneral.ejs', viewArgs);
            return;
        }

        if(!validator.isBoardName(data.boardName)) {
            viewArgs.ERROR = 'Invalid board name';
            reply.view('apGeneral.ejs', viewArgs);
            return;
        }


        try {
            await this.database.update_Value_Of_Variables_By_Key('BOARD_NAME', data.boardName);

            await variable.reload(this.database);

            viewArgs.INFO = 'Settings saved';
            viewArgs.BOARD_NAME = variable.get('BOARD_NAME');
            viewArgs.boardName = variable.get('BOARD_NAME');

        } catch(e) {
            console.error(e);
            viewArgs.ERROR = 'An error has occured, retry later';
        }

        
        reply.view('apGeneral.ejs', viewArgs);

    }
}
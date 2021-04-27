const variable = require('../util/variableManager');
const validator = require('../util/validator');
const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.user.global_group !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
        } else {
            request.view_args.board_name = variable.get('BOARD_NAME');
            reply.view('apGeneral.ejs', request.view_args);
        }
    },

    post: async (request, reply) => {

        if(request.user.global_group !== pex.GLOBAL_ADMIN) {
            reply.redirect('/');
            return;
        }
        
        const view_args = request.view_args;
        view_args.board_name = variable.get('BOARD_NAME');

        const data = request.body;

        data.board_name = data.board_name.trim();

        if(data.board_name === variable.get('BOARD_NAME')) {
            view_args.INFO = 'Settings saved';
            reply.view('apGeneral.ejs', view_args);
            return;
        }

        if(!validator.isBoardName(data.board_name)) {
            view_args.ERROR = 'Invalid board name';
            reply.view('apGeneral.ejs', view_args);
            return;
        }

        const VariableModel = db.getVariableModel();

        try {
            await VariableModel.update({value: data.board_name}, {where: {key: 'BOARD_NAME'}});
            const success = await variable.reload();

            if(success) {
                view_args.INFO = 'Settings saved';
                view_args.board_name = variable.get('BOARD_NAME');
            } else 
                view_args.ERROR = 'An error has occured, retry later';

        } catch(err) {
            console.log(err);
            view_args.ERROR = 'An error has occured, retry later';
        }

        
        reply.view('apGeneral.ejs', view_args);

    }
}
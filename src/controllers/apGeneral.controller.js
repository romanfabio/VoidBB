const variable = require('../util/variableManager');
const validator = require('../util/validator');
const db = require('../database/db');
const pex = require('../util/permissionManager');

module.exports = {
    get: (request, reply) => {
        if(request.user_global_group != pex.GLOBAL_ADMIN) {
            reply.redirect('/');
        } else {
            request.view_params.board_name = variable.get('BOARD_NAME');
            reply.view('apGeneral.ejs', request.view_params);
        }
    },

    post: (request, reply) => {

        if(request.user_global_group != pex.GLOBAL_ADMIN) {
            reply.redirect('/');
            return;
        }
        
        const view_params = request.view_params;
        view_params.board_name = variable.get('BOARD_NAME');

        const data = request.body;

        data.board_name = data.board_name.trim();

        if(data.board_name === variable.get('BOARD_NAME')) {
            view_params.INFO = 'Settings saved';
            reply.view('apGeneral.ejs', view_params);
            return;
        }

        if(!validator.isBoardName(data.board_name)) {
            view_params.ERROR = 'Invalid board name';
            reply.view('apGeneral.ejs', view_params);
            return;
        }

        const VariableModel = db.getVariableModel();

        VariableModel.update({value: data.board_name}, {where: {key: 'BOARD_NAME'}})
            .then(() => variable.reload())
            .then((success) => {
                if(success) {
                    view_params.INFO = 'Settings saved';
                    view_params.board_name = variable.get('BOARD_NAME');
                } else 
                    view_params.ERROR = 'An error has occured, retry later';

                reply.view('apGeneral.ejs', view_params);
            })
            .catch(err => {
                console.log(err);
                view_params.ERROR = 'An error has occured, retry later';
                reply.view('apGeneral.ejs', view_params);
            });
    }
}
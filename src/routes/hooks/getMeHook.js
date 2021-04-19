const pex = require('../../util/permissionManager');
const db = require('../../database/db');

/*
    Always
        - request.view_params : object = <parameters to be passed to the view>
    Authenticated User
        - request.is_auth : string = <user's username>
        - request.user_global_group : number = <user's global group id>
    Non-Authenticated User
        - request.user_global_group : number = <Anonymous global group id>
*/
module.exports = (request, reply, done) => {
    console.log('GetMe Hook');

    request.view_params = {};

    const username = request.session.get('username');
    if(username) {

        const msgs = reply.flash();

        if(msgs.info)
            request.view_params.INFO = msgs.info[0];
        if(msgs.error)
            request.view_params.ERROR = msgs.error[0];

        const UserModel = db.getUserModel();

        UserModel.findByPk(username, {attributes: ['global_group']})
            .then((user) => {
                if(user === null) {
                    request.user_global_group = pex.GLOBAL_ANONYMOUS;
                    request.session.delete();
                    done();
                } else {
                    request.is_auth = username;
                    request.view_params.USERNAME = username;
                    request.user_global_group = user.global_group;
                    done();
                }
            }, (err) => {
                console.log(err);
                request.user_global_group = pex.GLOBAL_ANONYMOUS;
                done();
            });
    } else {
        request.user_global_group = pex.GLOBAL_ANONYMOUS;
        done();
    }
}

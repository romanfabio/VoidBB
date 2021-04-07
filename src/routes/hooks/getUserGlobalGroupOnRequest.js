const pex = require('../../util/permissionManager');
const db = require('../../database/db');

module.exports = (request, reply, done) => {
    const username = request.session.get('username');

    if(username) {

        const UserModel = db.getUserModel();

        UserModel.findByPk(username, {attributes: ['global_group']})
            .then((user) => {
                if(user === null) {
                    request.user_global_group = pex.defaultGlobalGroup.Anonymous;
                } else {
                    request.user_global_group = user.global_group;
                    request.user_username = username;
                }
                done();
            }, (err) => {
                console.log(err);
                request.user_global_group = pex.defaultGlobalGroup.Anonymous;
                done();
            });
    } else {
        request.user_global_group = pex.defaultGlobalGroup.Anonymous;
        done();
    }
}

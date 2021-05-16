const variable = require('../../util/variableManager');
/*
    Require
        - isAuth hook
    Always
        - request.viewArgs : object = <view's data>
        - request.viewArgs.BOARD_NAME : string = <view's data>
    Authenticated User
        - request.viewArgs.USERNAME : string = <view's data>
*/
module.exports = (request, reply, done) => {
    console.log('view Hook');

    request.viewArgs = {};

    if(request.user.username)
        request.viewArgs.USERNAME = request.user.username;

    request.viewArgs.BOARD_NAME = variable.get('BOARD_NAME');

    done();
}
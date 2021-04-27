const variable = require('../../util/variableManager');
/*
    Require
        - isAuth hook
    Always
        - request.view_args : object = <view's data>
        - request.vire_args.BOARD_NAME : string = <view's data>
    Authenticated User
        - request.view_args.USERNAME : string = <view's data>
*/
module.exports = (request, reply, done) => {
    console.log('view Hook');

    request.view_args = {};

    if(request.user.username)
        request.view_args.USERNAME = request.user.username;

    request.view_args.BOARD_NAME = variable.get('BOARD_NAME');

    done();
}
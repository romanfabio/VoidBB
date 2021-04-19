/*
    Always
        - request.view_params : object = <parameters to be passed to the view>
    Authenticated User
        - request.is_auth : string = <user's username>
*/
module.exports = (request, reply, done) => {
    console.log('isAuth Hook');
    const username = request.session.get('username');

    request.view_params = {};

    if(username) {
        request.is_auth = username;
        request.view_params.USERNAME = username;
    }

    done();
}
/*
    Always
        - request.user : object = <user's data>
    Authenticated User
        - request.user.username : string = <user's name>
*/
module.exports = (request, reply, done) => {
    console.log('isAuth Hook');

    const username = request.session.get('user');

    request.user = {};

    if(username)
        request.user.username = username;

    done();
}
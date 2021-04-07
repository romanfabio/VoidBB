/*
    Authenticated User
        - request.is_auth : string = <user's username>
*/
module.exports = (request, reply, done) => {
    console.log('isAuth Hook');
    const username = request.session.get('username');

    if(username)
        request.is_auth = 'username';

    done();
}
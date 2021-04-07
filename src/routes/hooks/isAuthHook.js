module.exports = (request, reply, done) => {
    const username = request.session.get('username');

    if(username)
        request.is_auth = 'username';

    done();
}
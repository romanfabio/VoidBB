module.exports = {
    get: (request, reply) => {
        if(request.user.username)
            request.session.delete();
        reply.redirect('/');
    }
}
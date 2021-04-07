module.exports = {
    get: (request, reply) => {
        if(request.is_auth)
            request.session.delete();
        reply.redirect('/');
    }
}
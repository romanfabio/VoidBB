module.exports = {
    get: (request, reply) => {
        if(request.session.get('username'))
            request.session.delete();
        reply.redirect('/');
    }
}
module.exports = {
    get: (request, reply) => {
        if(request.isAuth)
            request.session.delete();
        reply.redirect('/');
    }
}
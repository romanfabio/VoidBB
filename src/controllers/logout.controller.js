module.exports = {
    get: function (request, reply) {
        if(request.user.username)
            request.session.delete();
        reply.redirect('/');
    }
}
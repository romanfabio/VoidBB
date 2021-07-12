const pex = require('../util/permissionManager');
const validator = require('../util/validator');
const variable = require('../util/variableManager');

module.exports = {
    get: async function (request, reply) {
        const name = request.params.name;

        if (name.length > 0) { // if url ends with /fsettings/ , name is an invalid empty string, so redirect user to home

            if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {
                reply.redirect('/');
                return;
            }

            try {

                let forum;
                // Global admins have full permission
                if (request.user.globalGroup === pex.GLOBAL_ADMIN){
                    let result = await this.database.select('*').from('Forums').where('name', name);

                    if(result.length !== 1) {
                        // Forum doesn't exist, redirect to home
                        reply.redirect('/');
                        return;
                    }
                    forum = result[0];
                } else {
                    let result = await this.database.select('*').from('Forums').where('name', name).andWhere('creator', request.user.username);

                    if (result.length !== 1) {
                        // Forum doesn't exist or the user is not an admin of this forum
                        reply.redirect('/');
                        return;
                    }
                    forum = result[0];
                }

                const viewArgs = request.viewArgs;

                viewArgs.forumName = forum.name;
                viewArgs.description = forum.description;

                if(pex.isGlobalSet(request.user.globalGroup, pex.globalBit.CHANGE_FORUM_PEX) || request.user.globalGroup === pex.GLOBAL_ADMIN) {

                    const mask = forum.pexMask;
                    viewArgs.pex = {};

                    viewArgs.pex.A_CRT_POST =       (mask[pex.forumBit.A_CRT_POST]=='1'?'checked':'');
                    viewArgs.pex.A_CRT_COMMENT =    (mask[pex.forumBit.A_CRT_COMMENT]=='1'?'checked':'');
                    viewArgs.pex.U_CRT_POST =       (mask[pex.forumBit.U_CRT_POST]=='1'?'checked':'');
                    viewArgs.pex.U_CRT_COMMENT =    (mask[pex.forumBit.U_CRT_COMMENT]=='1'?'checked':'');
                    viewArgs.pex.M_CRT_POST =       (mask[pex.forumBit.M_CRT_POST]=='1'?'checked':'');
                    viewArgs.pex.M_CRT_COMMENT =    (mask[pex.forumBit.M_CRT_COMMENT]=='1'?'checked':'');

                }

                reply.view('fSettings.ejs', viewArgs);

            } catch (e) {
                console.error(e);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }
    },

    post: async function (request, reply) {
        const name = request.params.name;

        if (name.length > 0) { // if url ends with /fsettings/ , name is an invalid empty string, so redirect user to home

            if (!pex.isGlobalSet(request.user.globalGroup, pex.globalBit.VIEW_FORUM)) {
                reply.redirect('/');
                return;
            }

            try {

                // Global admins have full permission
                if (request.user.globalGroup === pex.GLOBAL_ADMIN){
                    let result = await this.database.select('name').from('Forums').where('name', name);

                    if(result.length !== 1) {
                        // Forum doesn't exist, redirect to home
                        reply.redirect('/');
                        return;
                    }
                } else {
                    let result = await this.database.select('name').from('Forums').where('name', name).andWhere('creator', request.user.username);

                    if (result.length !== 1) {
                        // Forum doesn't exist or the user is not an admin of this forum
                        reply.redirect('/');
                        return;
                    }
                }

                const data = request.body;

                if(data.action === 'description' && data.description !== undefined) {
                    data.description = data.description.trim();
                    if(validator.isForumDescription(data.description)) {

                        await this.database('Forums').where('name', name).update({description: data.description});

                        request.flash('info', 'Description changed');
                        reply.redirect('/fsettings/' + name)
                    } else {
                        request.flash('error', 'Invalid Description');
                        reply.redirect('/fsettings/' + name);
                    }
                } else if(data.action === 'pex') { 
                    const pexMask = fillPexMask(data);

                    await this.database('Forums').where('name', name).update({pexMask: pexMask});
                    request.flash('info', 'Permissions changed');
                    reply.redirect('/fsettings/' + name);

                } else {
                    // TODO Check if we can redirect user to /fsettings/:name
                    reply.redirect('/');
                }

            } catch (e) {
                console.error(e);
                reply.redirect('/');
            }

        } else {
            reply.redirect('/');
        }
    }
}

function fillPexMask(data) {
    let required = pex.REQUIRED_FORUM_PEX;

    if(data.A_CRT_POST)
        required = setOn(required, pex.forumBit.A_CRT_POST);
    if(data.A_CRT_COMMENT)
        required = setOn(required, pex.forumBit.A_CRT_COMMENT);
    if(data.U_CRT_POST)
        required = setOn(required, pex.forumBit.U_CRT_POST);
    if(data.U_CRT_COMMENT)
        required = setOn(required, pex.forumBit.U_CRT_COMMENT);
    if(data.M_CRT_POST)
        required = setOn(required, pex.forumBit.M_CRT_POST);
    if(data.M_CRT_COMMENT)
        required = setOn(required, pex.forumBit.M_CRT_COMMENT);

    return required;
}

function setOn(str,index) {
    return str.substring(0,index) + '1' + str.substring(index+1);
}
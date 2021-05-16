/*
    Require
        - view Hook
    Info message available
        - request.viewArgs.INFO : string = <view's data>
    Error message available
        - request.viewArgs.ERROR : string = <view's data>
*/
module.exports = (request, reply, done) => {
    console.log('message Hook');

    const msgs = reply.flash();

    if (msgs) {
        if (msgs.info)
            request.viewArgs.INFO = msgs.info[0];
        if (msgs.error)
            request.viewArgs.ERROR = msgs.error[0];
    }
    
    done();
}
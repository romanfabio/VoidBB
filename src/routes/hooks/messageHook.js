/*
    Require
        - view Hook
    Info message available
        - request.view_args.INFO : string = <view's data>
    Error message available
        - request.view_args.ERROR : string = <view's data>
*/
module.exports = (request, reply, done) => {
    console.log('message Hook');

    const msgs = reply.flash();

    if (msgs) {
        if (msgs.info)
            request.view_args.INFO = msgs.info[0];
        if (msgs.error)
            request.view_args.ERROR = msgs.error[0];
    }
    
    done();
}
module.exports = {
    home: (reply, extra) => {
        reply.view('home.ejs', {title: 'Home', styles: ['home.css'], ...extra});
    },
    login: (reply, extra) => {
        reply.view('login.ejs', {title: 'Login', ...extra});
    },
    register: (reply, extra) => {
        reply.view('register.ejs', {title: 'Register', ...extra});
    },
    newTopic: (reply, extra) => {
        reply.view('newTopic.ejs', {title: 'New Topic', ...extra});
    },
    viewForum: (reply, extra) => {
        reply.view('viewForum.ejs', {title: 'View Forum', ...extra});
    },
    newForum: (reply, extra) => {
        reply.view('newForum.ejs', {title: 'New Forum', ...extra});
    },
    deadend: (reply, extra) => { // extra must have property 'back'
        reply.view('deadend.ejs', {title: 'End', ...extra});
    }
    
}
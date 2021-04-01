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
    }
}
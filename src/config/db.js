let user = [{username: 'pippo', email:'piippoandfriends@libero.it', password: 'efjwifjfijfifew3283'}];
let post = [{title: 'My first post', description: 'Hello everyone!'}];

module.exports = {
    getAllPosts: () => {
        return post;
    },
    getAllUsers: () => {
        return user;
    },
    insertPost: (p) => {
        post.push(p);
    },
    insertUser: (u) => {
        user.push(u);
    }
}
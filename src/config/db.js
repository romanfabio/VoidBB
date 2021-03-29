let user = [];
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
    }
}
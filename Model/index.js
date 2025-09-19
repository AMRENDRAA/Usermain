const User = require('./User');
// const Post = require('./Post');
// const Comment = require('./Comment');
const UserProfile = require('./userprofile');

// Define Associations

// One-to-One: User has one UserProfile
User.hasOne(UserProfile, {
    foreignKey: 'userId',
    as: 'profile',
    onDelete: 'CASCADE' // When user is deleted, profile is also deleted
});

UserProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// // One-to-Many: User has many Posts
// User.hasMany(Post, {
//     foreignKey: 'userId',
//     as: 'posts',
//     onDelete: 'CASCADE' // When user is deleted, their posts are also deleted
// });

// Post.belongsTo(User, {
//     foreignKey: 'userId',
//     as: 'author'
// });

// // One-to-Many: Post has many Comments
// Post.hasMany(Comment, {
//     foreignKey: 'postId',
//     as: 'comments',
//     onDelete: 'CASCADE' // When post is deleted, its comments are also deleted
// });

// Comment.belongsTo(Post, {
//     foreignKey: 'postId',
//     as: 'post'
// });

// // One-to-Many: User has many Comments
// User.hasMany(Comment, {
//     foreignKey: 'userId',
//     as: 'comments',
//     onDelete: 'CASCADE' // When user is deleted, their comments are also deleted
// });


// Comment.belongsTo(User, {
//     foreignKey: 'userId',
//     as: 'author'
// });

// // Many-to-Many: Users can like many Posts, Posts can be liked by many Users
// // This creates a junction table called 'PostLikes'
// User.belongsToMany(Post, {
//     through: 'PostLikes',
//     foreignKey: 'userId',
//     otherKey: 'postId',
//     as: 'likedPosts',
//     timestamps: false
// });

// Post.belongsToMany(User, {
//     through: 'PostLikes',
//     foreignKey: 'postId',
//     otherKey: 'userId',
//     as: 'likedBy',
//     timestamps: false
// });

module.exports = {
    User,
    UserProfile,
    // Post,
    // Comment
};

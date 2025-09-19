# 🚀 Practical Sequelize Associations Examples

## What Happens When You Run Your Application

### 1. Database Tables Created

When you run `npm start`, Sequelize automatically creates these tables:

```sql
-- 1. USERS table
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `role` enum('user','admin','moderator') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

-- 2. USER_PROFILES table
CREATE TABLE `UserProfiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bio` text,
  `avatar` varchar(255),
  `phone` varchar(255),
  `address` varchar(255),
  `dateOfBirth` datetime,
  `website` varchar(255),
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `user_profiles_userId_fkey` 
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. POSTS table
CREATE TABLE `Posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255),
  `published` tinyint(1) DEFAULT 0,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `posts_userId_fkey` 
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. COMMENTS table
CREATE TABLE `Comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `comments_userId_fkey` 
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_postId_fkey` 
    FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. POST_LIKES table (Junction table for many-to-many)
CREATE TABLE `PostLikes` (
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  PRIMARY KEY (`userId`, `postId`),
  CONSTRAINT `postlikes_userId_fkey` 
    FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postlikes_postId_fkey` 
    FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
);
```

---

## 📝 Step-by-Step Examples

### Example 1: Creating a Complete User Profile

```javascript
// 1. Create a user
const user = await User.create({
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'hashedpassword123',
    role: 'user'
});

console.log('User created:', user.toJSON());
// Output: { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', ... }

// 2. Create user profile
const profile = await UserProfile.create({
    bio: 'Full-stack developer passionate about Node.js',
    avatar: 'https://example.com/avatar.jpg',
    phone: '+1-555-0123',
    address: '123 Main St, City, State',
    dateOfBirth: new Date('1990-01-15'),
    website: 'https://johndoe.dev',
    userId: user.id  // This links the profile to the user
});

console.log('Profile created:', profile.toJSON());
// Output: { id: 1, bio: 'Full-stack developer...', userId: 1, ... }
```

### Example 2: Creating Posts and Comments

```javascript
// 3. Create posts for the user
const post1 = await Post.create({
    title: 'Getting Started with Sequelize',
    content: 'Sequelize is a powerful ORM for Node.js...',
    image: 'https://example.com/sequelize.jpg',
    published: true,
    userId: user.id  // This links the post to the user
});

const post2 = await Post.create({
    title: 'Database Relationships Explained',
    content: 'Understanding one-to-one, one-to-many...',
    published: false,
    userId: user.id
});

console.log('Posts created:', [post1.toJSON(), post2.toJSON()]);

// 4. Create comments on posts
const comment1 = await Comment.create({
    content: 'Great article! Very helpful.',
    userId: user.id,  // Who made the comment
    postId: post1.id  // Which post is being commented on
});

const comment2 = await Comment.create({
    content: 'Looking forward to the next part!',
    userId: user.id,
    postId: post1.id
});

console.log('Comments created:', [comment1.toJSON(), comment2.toJSON()]);
```

### Example 3: Many-to-Many Relationships (Likes)

```javascript
// 5. Create another user to like posts
const user2 = await User.create({
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com',
    password: 'hashedpassword456'
});

// 6. User2 likes post1
await user2.addLikedPost(post1);

// 7. User1 likes their own post
await user.addLikedPost(post1);

// 8. Check if user2 liked post1
const hasLiked = await user2.hasLikedPost(post1);
console.log('User2 liked post1:', hasLiked); // true

// 9. Get all posts liked by user2
const likedPosts = await user2.getLikedPosts();
console.log('Posts liked by user2:', likedPosts.map(p => p.title));
// Output: ['Getting Started with Sequelize']
```

---

## 🔍 Querying with Associations

### Example 4: Get User with All Related Data

```javascript
// Get user with profile, posts, and comments
const userWithData = await User.findByPk(user.id, {
    include: [
        {
            model: UserProfile,
            as: 'profile'
        },
        {
            model: Post,
            as: 'posts',
            include: [
                {
                    model: Comment,
                    as: 'comments',
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['id', 'firstname', 'lastname']
                        }
                    ]
                }
            ]
        }
    ]
});

console.log('User with all data:', JSON.stringify(userWithData, null, 2));
```

**Output:**
```json
{
  "id": 1,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "profile": {
    "id": 1,
    "bio": "Full-stack developer passionate about Node.js",
    "avatar": "https://example.com/avatar.jpg",
    "userId": 1
  },
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with Sequelize",
      "content": "Sequelize is a powerful ORM for Node.js...",
      "userId": 1,
      "comments": [
        {
          "id": 1,
          "content": "Great article! Very helpful.",
          "userId": 1,
          "postId": 1,
          "author": {
            "id": 1,
            "firstname": "John",
            "lastname": "Doe"
          }
        }
      ]
    }
  ]
}
```

### Example 5: Get Post with Author and All Comments

```javascript
// Get post with author and all comments
const postWithData = await Post.findByPk(post1.id, {
    include: [
        {
            model: User,
            as: 'author',
            attributes: ['id', 'firstname', 'lastname', 'email']
        },
        {
            model: Comment,
            as: 'comments',
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'firstname', 'lastname']
                }
            ]
        }
    ]
});

console.log('Post with author and comments:', JSON.stringify(postWithData, null, 2));
```

### Example 6: Get All Posts with Like Count

```javascript
// Get all posts with like count
const postsWithLikes = await Post.findAll({
    include: [
        {
            model: User,
            as: 'author',
            attributes: ['id', 'firstname', 'lastname']
        },
        {
            model: User,
            as: 'likedBy',
            attributes: ['id', 'firstname', 'lastname']
        }
    ]
});

// Add like count to each post
const postsWithLikeCount = postsWithLikes.map(post => ({
    ...post.toJSON(),
    likeCount: post.likedBy.length
}));

console.log('Posts with like count:', postsWithLikeCount);
```

---

## 🗑️ Cascade Delete Examples

### Example 7: What Happens When You Delete a User

```javascript
// Delete user (this will cascade delete all related data)
await User.destroy({ where: { id: user.id } });

// Check if user still exists
const deletedUser = await User.findByPk(user.id);
console.log('User exists:', deletedUser); // null

// Check if profile was deleted (should be null)
const deletedProfile = await UserProfile.findOne({ where: { userId: user.id } });
console.log('Profile exists:', deletedProfile); // null

// Check if posts were deleted (should be empty array)
const deletedPosts = await Post.findAll({ where: { userId: user.id } });
console.log('Posts exist:', deletedPosts.length); // 0

// Check if comments were deleted (should be empty array)
const deletedComments = await Comment.findAll({ where: { userId: user.id } });
console.log('Comments exist:', deletedComments.length); // 0

// Check if likes were deleted (should be empty array)
const deletedLikes = await PostLikes.findAll({ where: { userId: user.id } });
console.log('Likes exist:', deletedLikes.length); // 0
```

---

## 🔧 Advanced Query Examples

### Example 8: Complex Queries with Associations

```javascript
// Get all published posts with their authors and comment counts
const publishedPosts = await Post.findAll({
    where: { published: true },
    include: [
        {
            model: User,
            as: 'author',
            attributes: ['id', 'firstname', 'lastname']
        },
        {
            model: Comment,
            as: 'comments',
            attributes: ['id'] // Only get IDs for counting
        }
    ],
    order: [['createdAt', 'DESC']]
});

// Add comment count to each post
const postsWithCommentCount = publishedPosts.map(post => ({
    ...post.toJSON(),
    commentCount: post.comments.length
}));

console.log('Published posts with comment count:', postsWithCommentCount);
```

### Example 9: Get Users Who Liked a Specific Post

```javascript
// Get all users who liked post1
const postWithLikers = await Post.findByPk(post1.id, {
    include: [
        {
            model: User,
            as: 'likedBy',
            attributes: ['id', 'firstname', 'lastname', 'email']
        }
    ]
});

console.log('Users who liked post1:', postWithLikers.likedBy);
```

### Example 10: Get User's Activity Feed

```javascript
// Get user's activity (posts they created and posts they liked)
const userActivity = await User.findByPk(user2.id, {
    include: [
        {
            model: Post,
            as: 'posts',
            attributes: ['id', 'title', 'createdAt']
        },
        {
            model: Post,
            as: 'likedPosts',
            attributes: ['id', 'title', 'createdAt']
        }
    ]
});

console.log('User activity:', {
    createdPosts: userActivity.posts,
    likedPosts: userActivity.likedPosts
});
```

---

## 🎯 Summary

These examples show you:

1. **How tables are created** with proper relationships
2. **How to create data** with associations
3. **How to query data** with relationships
4. **How cascade deletes work** automatically
5. **How to perform complex queries** with multiple associations

The key is understanding that Sequelize handles all the foreign key relationships automatically, and you can use the association aliases to easily fetch related data in a single query.

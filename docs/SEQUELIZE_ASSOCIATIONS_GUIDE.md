# 📚 Complete Sequelize Associations Learning Guide

## Table of Contents
1. [Introduction to Associations](#introduction)
2. [Association Types Explained](#association-types)
3. [Detailed Parameter Reference](#parameters)
4. [Database Tables Created](#database-tables)
5. [Many-to-Many Deep Dive](#many-to-many)
6. [Practical Examples](#examples)
7. [Best Practices](#best-practices)

---

## 🎯 Introduction to Associations

Associations in Sequelize are **relationships between database tables**. They define how data in one table relates to data in another table.

### Why Use Associations?
- **Data Integrity**: Ensures related data stays consistent
- **Easy Queries**: Fetch related data in one query
- **Automatic Cleanup**: Delete related records when parent is deleted
- **Type Safety**: Get proper data types and relationships

---

## 🔗 Association Types Explained

### 1. One-to-One (hasOne/belongsTo)
**Real-world example**: User ↔ UserProfile
- Each user has **exactly one** profile
- Each profile belongs to **exactly one** user

### 2. One-to-Many (hasMany/belongsTo)
**Real-world example**: User → Posts
- One user can have **many** posts
- Each post belongs to **exactly one** user

### 3. Many-to-Many (belongsToMany)
**Real-world example**: Users ↔ Posts (likes)
- Users can like **many** posts
- Posts can be liked by **many** users

---

## 📋 Detailed Parameter Reference

### hasOne() Parameters

```javascript
User.hasOne(UserProfile, {
    // REQUIRED PARAMETERS
    foreignKey: 'userId',           // Column name in target table
    
    // OPTIONAL PARAMETERS
    as: 'profile',                  // Alias for the association
    onDelete: 'CASCADE',            // What happens when parent is deleted
    onUpdate: 'CASCADE',            // What happens when parent is updated
    constraints: true,              // Enable foreign key constraints
    hooks: true,                    // Enable lifecycle hooks
    
    // ADVANCED PARAMETERS
    sourceKey: 'id',                // Column in source table (default: primary key)
    targetKey: 'id',                // Column in target table (default: primary key)
    scope: { isActive: true },      // Additional WHERE conditions
    foreignKeyConstraint: true,     // Create foreign key constraint
    unique: true,                   // Make foreign key unique
    allowNull: false,               // Allow null values in foreign key
    defaultValue: null,             // Default value for foreign key
    validate: true,                 // Validate foreign key
    field: 'userId',                // Alias for foreign key column
    name: 'user_profile_fk'         // Name for foreign key constraint
});
```

### hasMany() Parameters

```javascript
User.hasMany(Post, {
    // REQUIRED PARAMETERS
    foreignKey: 'userId',           // Column name in target table
    
    // OPTIONAL PARAMETERS
    as: 'posts',                    // Alias for the association
    onDelete: 'CASCADE',            // What happens when parent is deleted
    onUpdate: 'CASCADE',            // What happens when parent is updated
    constraints: true,              // Enable foreign key constraints
    hooks: true,                    // Enable lifecycle hooks
    
    // ADVANCED PARAMETERS
    sourceKey: 'id',                // Column in source table
    targetKey: 'id',                // Column in target table
    scope: { published: true },     // Additional WHERE conditions
    foreignKeyConstraint: true,     // Create foreign key constraint
    allowNull: false,               // Allow null values in foreign key
    defaultValue: null,             // Default value for foreign key
    validate: true,                 // Validate foreign key
    field: 'userId',                // Alias for foreign key column
    name: 'user_posts_fk'           // Name for foreign key constraint
});
```

### belongsTo() Parameters

```javascript
Post.belongsTo(User, {
    // REQUIRED PARAMETERS
    foreignKey: 'userId',           // Column name in this table
    
    // OPTIONAL PARAMETERS
    as: 'author',                   // Alias for the association
    onDelete: 'SET NULL',           // What happens when parent is deleted
    onUpdate: 'CASCADE',            // What happens when parent is updated
    constraints: true,              // Enable foreign key constraints
    hooks: true,                    // Enable lifecycle hooks
    
    // ADVANCED PARAMETERS
    targetKey: 'id',                // Column in target table
    sourceKey: 'userId',            // Column in this table
    scope: { isActive: true },      // Additional WHERE conditions
    foreignKeyConstraint: true,     // Create foreign key constraint
    allowNull: true,                // Allow null values in foreign key
    defaultValue: null,             // Default value for foreign key
    validate: true,                 // Validate foreign key
    field: 'userId',                // Alias for foreign key column
    name: 'post_user_fk'            // Name for foreign key constraint
});
```

### belongsToMany() Parameters

```javascript
User.belongsToMany(Post, {
    // REQUIRED PARAMETERS
    through: 'PostLikes',           // Junction table name or model
    
    // OPTIONAL PARAMETERS
    foreignKey: 'userId',           // Column name in junction table
    otherKey: 'postId',             // Column name in junction table
    as: 'likedPosts',               // Alias for the association
    onDelete: 'CASCADE',            // What happens when parent is deleted
    onUpdate: 'CASCADE',            // What happens when parent is updated
    constraints: true,              // Enable foreign key constraints
    hooks: true,                    // Enable lifecycle hooks
    
    // ADVANCED PARAMETERS
    sourceKey: 'id',                // Column in source table
    targetKey: 'id',                // Column in target table
    scope: { isActive: true },      // Additional WHERE conditions
    foreignKeyConstraint: true,     // Create foreign key constraint
    allowNull: false,               // Allow null values in foreign key
    defaultValue: null,             // Default value for foreign key
    validate: true,                 // Validate foreign key
    field: 'userId',                // Alias for foreign key column
    name: 'user_post_likes_fk',     // Name for foreign key constraint
    timestamps: false,              // Disable timestamps in junction table
    unique: false,                  // Make combination unique
    paranoid: false,                // Enable soft deletes
    underscored: false,             // Use snake_case for column names
    freezeTableName: true,          // Don't pluralize table name
    tableName: 'PostLikes'          // Explicit table name
});
```

---

## 🗄️ Database Tables Created

### 1. One-to-One Relationship Tables

#### Users Table
```sql
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `role` enum('user','admin','moderator') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
);
```

#### UserProfiles Table
```sql
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
```

### 2. One-to-Many Relationship Tables

#### Posts Table
```sql
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
```

#### Comments Table
```sql
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
```

### 3. Many-to-Many Relationship Tables

#### PostLikes Junction Table
```sql
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

## 🔄 Many-to-Many Deep Dive

### What Happens in Many-to-Many Relationships?

1. **Junction Table Creation**: Sequelize automatically creates a table to store the relationships
2. **Foreign Keys**: Two foreign key columns pointing to both tables
3. **Composite Primary Key**: Combination of both foreign keys as primary key
4. **Constraints**: Foreign key constraints ensure data integrity

### Junction Table Structure

```sql
-- PostLikes table (automatically created)
CREATE TABLE `PostLikes` (
  `userId` int(11) NOT NULL,        -- Points to Users.id
  `postId` int(11) NOT NULL,        -- Points to Posts.id
  PRIMARY KEY (`userId`, `postId`)  -- Composite primary key
);
```

### How to Use Many-to-Many Relationships

```javascript
// Add a like (user likes a post)
await user.addLikedPost(post);

// Remove a like
await user.removeLikedPost(post);

// Check if user liked a post
const hasLiked = await user.hasLikedPost(post);

// Get all posts liked by user
const likedPosts = await user.getLikedPosts();

// Get all users who liked a post
const likers = await post.getLikedBy();

// Count likes
const likeCount = await post.countLikedBy();
```

---

## 💡 Practical Examples

### Example 1: Complete User with Profile and Posts

```javascript
// Create user with profile and posts
const user = await User.create({
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'hashedpassword'
});

// Create profile
const profile = await UserProfile.create({
    bio: 'Software Developer',
    phone: '123-456-7890',
    userId: user.id
});

// Create posts
const post1 = await Post.create({
    title: 'My First Post',
    content: 'Hello World!',
    userId: user.id
});

const post2 = await Post.create({
    title: 'Learning Sequelize',
    content: 'Sequelize is awesome!',
    userId: user.id
});
```

### Example 2: Query with Associations

```javascript
// Get user with all related data
const userWithData = await User.findByPk(userId, {
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
```

### Example 3: Many-to-Many Operations

```javascript
// User likes a post
await user.addLikedPost(post);

// User unlikes a post
await user.removeLikedPost(post);

// Get user's liked posts with details
const likedPosts = await user.getLikedPosts({
    include: [
        {
            model: User,
            as: 'author',
            attributes: ['id', 'firstname', 'lastname']
        }
    ]
});

// Get post with all likers
const postWithLikers = await Post.findByPk(postId, {
    include: [
        {
            model: User,
            as: 'likedBy',
            attributes: ['id', 'firstname', 'lastname']
        }
    ]
});
```

---

## 🎯 Best Practices

### 1. Naming Conventions
```javascript
// Good: Clear, descriptive aliases
User.hasMany(Post, { as: 'posts' });
Post.belongsTo(User, { as: 'author' });

// Bad: Unclear aliases
User.hasMany(Post, { as: 'p' });
Post.belongsTo(User, { as: 'u' });
```

### 2. Cascade Deletes
```javascript
// Good: Appropriate cascade behavior
User.hasMany(Post, { onDelete: 'CASCADE' }); // Delete posts when user deleted
Post.belongsTo(User, { onDelete: 'SET NULL' }); // Keep post, set userId to null
```

### 3. Foreign Key Naming
```javascript
// Good: Consistent naming
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Bad: Inconsistent naming
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'authorId' });
```

### 4. Association Organization
```javascript
// Good: Centralized associations
// In Model/index.js
User.hasOne(UserProfile, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
```

### 5. Query Optimization
```javascript
// Good: Only include what you need
const users = await User.findAll({
    include: [
        {
            model: Post,
            as: 'posts',
            attributes: ['id', 'title'], // Only get needed fields
            limit: 5 // Limit number of posts
        }
    ]
});
```

---

## 🚀 Advanced Features

### 1. Scoped Associations
```javascript
User.hasMany(Post, {
    foreignKey: 'userId',
    as: 'publishedPosts',
    scope: { published: true }
});
```

### 2. Custom Junction Table
```javascript
const PostLikes = sequelize.define('PostLikes', {
    likedAt: DataTypes.DATE,
    isActive: DataTypes.BOOLEAN
});

User.belongsToMany(Post, {
    through: PostLikes,
    foreignKey: 'userId',
    otherKey: 'postId'
});
```

### 3. Hooks with Associations
```javascript
User.hasMany(Post, {
    foreignKey: 'userId',
    hooks: true
});

Post.addHook('afterCreate', (post) => {
    console.log(`New post created: ${post.title}`);
});
```

---

## 📝 Summary

Sequelize associations provide a powerful way to:
- **Define relationships** between database tables
- **Ensure data integrity** with foreign key constraints
- **Simplify queries** by including related data
- **Automate cleanup** with cascade deletes
- **Maintain consistency** across your application

The key is to understand the different types of relationships and choose the appropriate association method for your use case. Always consider the data integrity implications and use meaningful aliases for better code readability.


# 🗄️ Database Schema Diagram

## Visual Representation of Table Relationships

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │  USER_PROFILES  │    │     POSTS       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ userId (FK)     │    │ id (PK)         │
│ firstname       │    │ bio             │    │ title           │
│ lastname        │    │ avatar          │    │ content         │
│ email           │    │ phone           │    │ image           │
│ password        │    │ address         │    │ published       │
│ isActive        │    │ dateOfBirth     │    │ userId (FK)     │◄──┐
│ role            │    │ website         │    │ createdAt       │   │
│ createdAt       │    │ createdAt       │    │ updatedAt       │   │
│ updatedAt       │    │ updatedAt       │    └─────────────────┘   │
└─────────────────┘    └─────────────────┘                        │
         │                                                         │
         │ 1:1 (hasOne/belongsTo)                                 │
         │                                                         │
         │ 1:Many (hasMany/belongsTo)                             │
         │                                                         │
         ▼                                                         │
┌─────────────────┐    ┌─────────────────┐                        │
│    COMMENTS     │    │   POST_LIKES    │                        │
├─────────────────┤    ├─────────────────┤                        │
│ id (PK)         │    │ userId (FK)     │◄───────────────────────┘
│ content         │    │ postId (FK)     │◄───────────────────────┐
│ userId (FK)     │◄───┤ PRIMARY KEY     │                        │
│ postId (FK)     │◄───┤ (userId, postId)│                        │
│ createdAt       │    └─────────────────┘                        │
│ updatedAt       │                                               │
└─────────────────┘                                               │
         │                                                         │
         │ Many:1 (belongsTo)                                     │
         │                                                         │
         ▼                                                         │
┌─────────────────┐                                               │
│     POSTS       │                                               │
├─────────────────┤                                               │
│ id (PK)         │                                               │
│ title           │                                               │
│ content         │                                               │
│ image           │                                               │
│ published       │                                               │
│ userId (FK)     │◄──────────────────────────────────────────────┘
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

## Relationship Types Explained

### 1. One-to-One (1:1)
```
USERS ←→ USER_PROFILES
```
- **Direction**: Bidirectional
- **Cardinality**: 1:1
- **Foreign Key**: `userId` in `USER_PROFILES`
- **Constraint**: UNIQUE on `userId`
- **Cascade**: CASCADE (if user deleted, profile deleted)

### 2. One-to-Many (1:Many)
```
USERS → POSTS
USERS → COMMENTS
POSTS → COMMENTS
```
- **Direction**: Unidirectional
- **Cardinality**: 1:Many
- **Foreign Key**: `userId` in `POSTS`, `userId` in `COMMENTS`, `postId` in `COMMENTS`
- **Constraint**: Regular foreign key
- **Cascade**: CASCADE (if parent deleted, children deleted)

### 3. Many-to-Many (Many:Many)
```
USERS ↔ POSTS (through POST_LIKES)
```
- **Direction**: Bidirectional
- **Cardinality**: Many:Many
- **Junction Table**: `POST_LIKES`
- **Foreign Keys**: `userId` and `postId` in `POST_LIKES`
- **Constraint**: Composite primary key
- **Cascade**: CASCADE (if user/post deleted, likes deleted)

## Table Creation Order

1. **USERS** (no dependencies)
2. **USER_PROFILES** (depends on USERS)
3. **POSTS** (depends on USERS)
4. **COMMENTS** (depends on USERS and POSTS)
5. **POST_LIKES** (depends on USERS and POSTS)

## Foreign Key Constraints

```sql
-- USER_PROFILES constraints
ALTER TABLE `UserProfiles` 
ADD CONSTRAINT `user_profiles_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- POSTS constraints
ALTER TABLE `Posts` 
ADD CONSTRAINT `posts_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- COMMENTS constraints
ALTER TABLE `Comments` 
ADD CONSTRAINT `comments_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Comments` 
ADD CONSTRAINT `comments_postId_fkey` 
FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- POST_LIKES constraints
ALTER TABLE `PostLikes` 
ADD CONSTRAINT `postlikes_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `PostLikes` 
ADD CONSTRAINT `postlikes_postId_fkey` 
FOREIGN KEY (`postId`) REFERENCES `Posts` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;
```

## Indexes Created

```sql
-- Primary keys (automatic)
PRIMARY KEY (`id`) on all tables

-- Unique constraints
UNIQUE KEY `email` (`email`) on USERS
UNIQUE KEY `userId` (`userId`) on USER_PROFILES

-- Composite primary key
PRIMARY KEY (`userId`, `postId`) on POST_LIKES

-- Foreign key indexes (automatic)
INDEX `posts_userId_fkey` on POSTS.userId
INDEX `comments_userId_fkey` on COMMENTS.userId
INDEX `comments_postId_fkey` on COMMENTS.postId
INDEX `postlikes_userId_fkey` on POST_LIKES.userId
INDEX `postlikes_postId_fkey` on POST_LIKES.postId
```

## Data Flow Examples

### Creating a User with Profile and Posts
```javascript
// 1. Create user
const user = await User.create({...});

// 2. Create profile (automatically links via userId)
const profile = await UserProfile.create({
    userId: user.id,
    bio: '...'
});

// 3. Create posts (automatically links via userId)
const post1 = await Post.create({
    userId: user.id,
    title: '...'
});

// 4. Create comments (links to both user and post)
const comment = await Comment.create({
    userId: user.id,
    postId: post1.id,
    content: '...'
});

// 5. Add likes (creates entry in POST_LIKES)
await user.addLikedPost(post1);
```

### Querying with Relationships
```javascript
// Get user with all related data
const user = await User.findByPk(userId, {
    include: [
        { model: UserProfile, as: 'profile' },
        { 
            model: Post, 
            as: 'posts',
            include: [
                { model: Comment, as: 'comments' }
            ]
        }
    ]
});
```

This schema ensures data integrity and provides a solid foundation for your application's data relationships.

# integration_example.md

## How to Call This Module

```javascript
// 1. Import
const { moderateContent } = require('./main.js');

// 2. Prepare input
const input = {
    contentText: "User's text here",
    userId: "user_123",
    contentCategory: "forum_post" // optional
};

// 3. Call the function
try {
    const result = moderateContent(input);
    console.log(result); // {decision: "APPROVE", score: 0, flaggedRules: []}
} catch (error) {
    console.error('Error:', error.message);
}
```
### Example: Forum System Integration
```json
// When user posts in forum
function submitPost(userId, postText) {
    const moderation = moderateContent({
        contentText: postText,
        userId: userId,
        contentCategory: "forum_post"
    });
    
    if (moderation.decision === 'APPROVE') {
        publishPost(postText);
    } else if (moderation.decision === 'REJECT') {
        notifyUserOfRejection(userId);
    }
    return moderation;
}
```

### Example: Profile System Integration
```json
// When user updates bio
function updateBio(userId, bioText) {
    const moderation = moderateContent({
        contentText: bioText,
        userId: userId,
        contentCategory: "profile_bio"
    });
    
    if (moderation.decision === 'REJECT') {
        throw new Error('Bio contains inappropriate content');
    }
    return moderation;
}
```
### Example: Profile System Integration
```json
// When user updates bio

function updateBio(userId, bioText) {
    const moderation = moderateContent({
        contentText: bioText,
        userId: userId,
        contentCategory: "profile_bio"
    });
    
    if (moderation.decision === 'REJECT') {
        throw new Error('Bio contains inappropriate content');
    }
    return moderation;
}
```
### Example: Profile System Integration
```json
// When user updates bio
function updateBio(userId, bioText) {
    const moderation = moderateContent({
        contentText: bioText,
        userId: userId,
        contentCategory: "profile_bio"
    });
    
    if (moderation.decision === 'REJECT') {
        throw new Error('Bio contains inappropriate content');
    }
    return moderation;
}
```
### Error Handling Example
```json
// Handle different error types
try {
    moderateContent({ userId: "test" }); // Missing contentText
} catch (error) {
    if (error.message.includes('required')) {
        console.log('Missing field error');
    } else if (error.message.includes('invalid')) {
        console.log('Invalid format error');
    }
}


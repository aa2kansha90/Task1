// inputHandler.js - REFACTORED
const VALID_CATEGORIES = ['forum_post', 'profile_bio', 'product_review', 'comment', 'direct_message'];
const MAX_CONTENT_LENGTH = 10000;
const USER_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Process and validate input for content moderation
 */
function processInput(rawInput) {
    validateInputStructure(rawInput);
    
    const { contentText, userId, contentCategory = 'forum_post' } = rawInput;
    
    validateContentText(contentText);
    validateUserId(userId);
    validateContentCategory(contentCategory);
    
    return {
        userId,
        contentCategory,
        normalizedText: normalizeText(contentText),
        originalText: contentText
    };
}

function validateInputStructure(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new Error('Input must be a JSON object');
    }
}

function validateContentText(text) {
    if (text === undefined || text === null) {
        throw new Error('contentText is required');
    }
    
    if (typeof text !== 'string') {
        throw new Error('contentText must be a string');
    }
    
    const trimmed = text.trim();
    if (text.length === 0 || trimmed.length === 0) {
        throw new Error('contentText cannot be empty');
    }
    
    if (text.length > MAX_CONTENT_LENGTH) {
        throw new Error(`contentText cannot exceed ${MAX_CONTENT_LENGTH} characters`);
    }
}

function validateUserId(userId) {
    if (userId === undefined || userId === null) {
        throw new Error('userId is required');
    }
    
    if (typeof userId !== 'string') {
        throw new Error('userId must be a string');
    }
    
    if (!USER_ID_PATTERN.test(userId)) {
        throw new Error('userId contains invalid characters. Use only letters, numbers, underscores, and hyphens.');
    }
}

function validateContentCategory(category) {
    if (!VALID_CATEGORIES.includes(category)) {
        throw new Error(`contentCategory must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
}

function normalizeText(text) {
    let normalized = text.trim().toLowerCase();
    normalized = normalized.replace(/\s+/g, ' ');
    normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '');
    return normalized;
}

module.exports = { processInput };
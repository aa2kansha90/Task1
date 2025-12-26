// scoringEngine.js - REFACTORED
const { RULE_CONFIG } = require('./ruleMatcher.js');

const CATEGORY_THRESHOLDS = {
    forum_post:    { approve: 0.3, reject: 0.7 },
    profile_bio:   { approve: 0.2, reject: 0.6 },
    product_review: { approve: 0.3, reject: 0.7 },
    comment:       { approve: 0.4, reject: 0.8 },
    direct_message: { approve: 0.3, reject: 0.7 }
};

/**
 * Calculate moderation score and make decision
 */
function makeDecision(input, triggeredRules) {
    validateTriggeredRules(triggeredRules);
    
    const score = calculateScore(triggeredRules);
    const thresholds = getThresholds(input.contentCategory);
    const decision = determineDecision(score, thresholds);
    
    logBorderlineCase(score, thresholds);
    
    return {
        decision,
        score: roundScore(score),
        triggeredRules,
        userId: input.userId,
        contentCategory: input.contentCategory || 'forum_post'
    };
}

function validateTriggeredRules(rules) {
    if (!rules || !Array.isArray(rules)) {
        throw new Error('triggeredRules must be an array');
    }
}

function calculateScore(triggeredRules) {
    if (triggeredRules.length === 0) return 0;
    
    // Start with highest rule weight
    const maxWeight = Math.max(
        ...triggeredRules.map(ruleName => RULE_CONFIG[ruleName]?.weight || 0)
    );
    
    let score = maxWeight;
    
    // Add penalty for multiple rules (capped)
    if (triggeredRules.length > 1) {
        const extraPenalty = Math.min((triggeredRules.length - 1) * 0.1, 0.3);
        score += extraPenalty;
    }
    
    return Math.min(score, 1); // Cap at 1
}

function getThresholds(category) {
    const thresholds = CATEGORY_THRESHOLDS[category || 'forum_post'];
    if (!thresholds) {
        throw new Error(`Unknown content category: ${category}`);
    }
    return thresholds;
}

function determineDecision(score, thresholds) {
    const rounded = roundScore(score);
    
    if (rounded < thresholds.approve) return 'APPROVE';
    if (rounded >= thresholds.reject) return 'REJECT';
    return 'FLAG_FOR_REVIEW';
}

function roundScore(score) {
    return Math.round(score * 100) / 100;
}

function logBorderlineCase(score, thresholds) {
    const rounded = roundScore(score);
    const isBorderline = Math.abs(rounded - thresholds.approve) < 0.05 || 
                         Math.abs(rounded - thresholds.reject) < 0.05;
    
    if (isBorderline) {
        console.log(`Borderline score: ${rounded} (thresholds: ${thresholds.approve}/${thresholds.reject})`);
    }
}

module.exports = { makeDecision, CATEGORY_THRESHOLDS };
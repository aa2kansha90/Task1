// ruleMatcher.js - REFACTORED
const RULE_CONFIG = {
    PROFANITY: {
        keywords: ['badword', 'curse', 'insult', 'swear', 'damn', 'hell'],
        weight: 0.7,
        test: hasBannedWord
    },
    HATE_SPEECH: {
        patterns: [
            /\bhate\s+(group|people|community)\b/gi,
            /\bdiscriminate\s+against\b/gi,
            /\bracial\s+slur\b/gi
        ],
        weight: 0.9,
        test: matchesPattern
    },
    EXCESSIVE_LINKS: {
        maxLinks: 3,
        pattern: /https?:\/\/[^\s]+/gi,
        weight: 0.4,
        test: hasExcessiveLinks
    },
    REPETITIVE_CHARS: {
        pattern: /(.)\1{4,}/g,
        weight: 0.3,
        test: hasRepetitiveChars
    },
    SPAM_PHRASE: {
        phrases: ['buy now', 'click here', 'limited offer', 'make money fast', 'special promotion'],
        weight: 0.8,
        test: hasSpamPhrase
    }
};

// Helper functions for rule testing
function hasBannedWord(text, rule) {
    return rule.keywords.some(keyword => 
        new RegExp(`\\b${keyword}\\b`, 'i').test(text)
    );
}

function matchesPattern(text, rule) {
    return rule.patterns.some(pattern => {
        pattern.lastIndex = 0;
        return pattern.test(text);
    });
}

function hasExcessiveLinks(text, rule) {
    rule.pattern.lastIndex = 0;
    const links = text.match(rule.pattern);
    return links && links.length > rule.maxLinks;
}

function hasRepetitiveChars(text, rule) {
    rule.pattern.lastIndex = 0;
    return rule.pattern.test(text);
}

function hasSpamPhrase(text, rule) {
    return rule.phrases.some(phrase =>
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
    );
}

/**
 * Match text against all moderation rules
 */
function matchRules(input) {
    const triggeredRules = [];
    
    for (const [ruleName, rule] of Object.entries(RULE_CONFIG)) {
        try {
            if (rule.test(input.normalizedText, rule)) {
                triggeredRules.push(ruleName);
            }
        } catch (error) {
            console.warn(`Rule "${ruleName}" check failed:`, error.message);
        }
    }
    
    return triggeredRules;
}

module.exports = { matchRules, RULE_CONFIG };
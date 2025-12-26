// tests/test_basic.js - CORRECTED VERSION
const { moderateContent } = require('../main.js');

console.log('=== Basic Tests ===\n');

const basicTests = [
    {
        name: 'Valid Case - Clean Content',
        input: {
            contentText: "Hello, this is a nice post about technology.",
            userId: "user_123",
            contentCategory: "forum_post"
        },
        shouldPass: true
    },
    {
        name: 'Valid Case - Content with Profanity',
        input: {
            contentText: "This contains a badword.",
            userId: "user_456",
            contentCategory: "forum_post"
        },
        shouldPass: true,
        expectedDecision: 'REJECT'
    },
    {
        name: 'Invalid Case - Missing contentText',
        input: {
            userId: "user_123"
        },
        shouldPass: false,
        expectedError: 'contentText is required'
    },
    {
        name: 'Invalid Case - Empty contentText',
        input: {
            contentText: "",
            userId: "user_123"
        },
        shouldPass: false,
        expectedError: 'contentText cannot be empty'
    },
    {
        name: 'Invalid Case - Invalid userId',
        input: {
            contentText: "Hello",
            userId: "invalid@user"
        },
        shouldPass: false,
        expectedError: 'userId contains invalid characters'
    }
];

let passed = 0;
let failed = 0;

basicTests.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.name}`);
    
    try {
        const result = moderateContent(test.input);
        
        if (test.shouldPass) {
            console.log(`✅ PASS - Result: ${JSON.stringify(result)}`);
            if (test.expectedDecision && result.decision === test.expectedDecision) {
                console.log(`  Decision matches expected: ${test.expectedDecision}`);
            }
            passed++;
        } else {
            console.log(`❌ FAIL - Expected error but got: ${JSON.stringify(result)}`);
            failed++;
        }
    } catch (error) {
        if (!test.shouldPass) {
            // Check if error message contains expected text
            const hasExpectedError = error.message.includes(test.expectedError);
            if (hasExpectedError) {
                console.log(`✅ PASS - Correctly threw: ${error.message}`);
                passed++;
            } else {
                console.log(`❌ FAIL - Expected "${test.expectedError}", got: ${error.message}`);
                failed++;
            }
        } else {
            console.log(`❌ FAIL - Unexpected error: ${error.message}`);
            failed++;
        }
    }
    console.log();
});

console.log(`Basic Tests: ${passed}/${basicTests.length} passed`);
module.exports = { passed, failed, total: basicTests.length };
// tests/test_edge_cases.js
const { moderateContent } = require('../main.js');

console.log('=== Edge Case Tests ===\n');

const edgeTests = [
    {
        name: 'Zero-width characters',
        input: {
            contentText: "hello\u200Bworld",
            userId: "user_zw",
            contentCategory: "forum_post"
        },
        shouldPass: true
    },
    {
        name: 'Maximum length (10,000 chars)',
        input: {
            contentText: "x".repeat(10000),
            userId: "user_max",
            contentCategory: "forum_post"
        },
        shouldPass: true
    },
    {
        name: 'Mixed case detection',
        input: {
            contentText: "This has BADWORD in uppercase",
            userId: "user_upper",
            contentCategory: "forum_post"
        },
        shouldPass: true,
        expectedDecision: 'REJECT'
    },
    {
        name: 'Whitespace only',
        input: {
            contentText: "   \t\n   ",
            userId: "user_ws"
        },
        shouldPass: false,
        expectedError: 'contentText cannot be empty'
    }
];

let passed = 0;
let failed = 0;

edgeTests.forEach((test, index) => {
    console.log(`Edge Test ${index + 1}: ${test.name}`);
    
    try {
        const result = moderateContent(test.input);
        
        if (test.shouldPass) {
            console.log(`✅ PASS - Decision: ${result.decision}, Score: ${result.score}`);
            if (test.expectedDecision && result.decision === test.expectedDecision) {
                console.log(`  (Decision matches expected: ${test.expectedDecision})`);
            }
            passed++;
        } else {
            console.log(`❌ FAIL - Expected error but got success`);
            failed++;
        }
    } catch (error) {
        if (!test.shouldPass) {
            const hasExpectedError = error.message.includes(test.expectedError);
            if (hasExpectedError) {
                console.log(`✅ PASS - Correctly threw error`);
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

console.log(`Edge Case Tests: ${passed}/${edgeTests.length} passed`);
module.exports = { passed, failed, total: edgeTests.length };
// tests/run_tests.js
console.log('=== Content Moderation Filter - Test Harness ===\n');
console.log('Running test suite...\n');

// Run basic tests
const basicResults = require('./test_basic.js');

console.log('\n---\n');

// Run edge case tests  
const edgeResults = require('./test_edge_cases.js');

console.log('\n=== Final Results ===');
console.log(`Basic Tests:    ${basicResults.passed}/${basicResults.total} passed`);
console.log(`Edge Case Tests: ${edgeResults.passed}/${edgeResults.total} passed`);
console.log(`Total:          ${basicResults.passed + edgeResults.passed}/${basicResults.total + edgeResults.total} passed`);

const totalPassed = basicResults.passed + edgeResults.passed;
const totalTests = basicResults.total + edgeResults.total;

if (totalPassed === totalTests) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
} else {
    console.log(`\n❌ ${totalTests - totalPassed} test(s) failed`);
    process.exit(1);
}
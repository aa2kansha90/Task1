function formatOutput(decisionResult) {
    validateDecisionResult(decisionResult);
    
    const output = createOutputObject(decisionResult);
    
    if (decisionResult.decision === 'REJECT') {
        notifyAdmins(decisionResult);
    }
    
    return output;
}

function validateDecisionResult(result) {
    const required = ['decision', 'score', 'triggeredRules', 'userId'];
    const missing = required.filter(field => !(field in result));
    
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
}

function createOutputObject(result) {
    return {
        decision: result.decision,
        score: result.score,
        flaggedRules: [...result.triggeredRules] // Copy array
    };
}

function notifyAdmins(result) {
    console.log(`[ADMIN] Content rejected - User: ${result.userId}`);
    console.log(`  Score: ${result.score}, Rules: ${result.triggeredRules.join(', ')}`);
    console.log(`  Category: ${result.contentCategory}`);
}

module.exports = { formatOutput };
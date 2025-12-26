// main.js - REFACTORED
const { processInput } = require('./inputHandler.js');
const { matchRules } = require('./ruleMatcher.js');
const { makeDecision } = require('./scoringEngine.js');
const { formatOutput } = require('./outputFormatter.js');
const logger = require('./logger.js');


function moderateContent(rawInput) {
    logger.info('Starting moderation', { userId: rawInput?.userId });
    
    try {
        const validatedInput = validateAndPreprocess(rawInput);
        const triggeredRules = applyModerationRules(validatedInput);
        const decision = evaluateContent(validatedInput, triggeredRules);
        const output = prepareFinalResult(decision);
        
        logger.info('Moderation completed', { decision: output.decision });
        return output;
        
    } catch (error) {
        logger.error('Moderation failed', { error: error.message });
        throw new Error(`Moderation failed: ${error.message}`);
    }
}

function validateAndPreprocess(rawInput) {
    logger.debug('Validating input');
    return processInput(rawInput);
}

function applyModerationRules(input) {
    logger.debug('Applying rules');
    const rules = matchRules(input);
    logger.info('Rules matched', { count: rules.length, rules });
    return rules;
}

function evaluateContent(input, triggeredRules) {
    logger.debug('Evaluating content');
    return makeDecision(input, triggeredRules);
}

function prepareFinalResult(decisionResult) {
    logger.debug('Formatting output');
    return formatOutput(decisionResult);
}

module.exports = { moderateContent };
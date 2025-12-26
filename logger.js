// logger.js - REFACTORED (Simplified)
const LOG_LEVELS = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
let currentLevel = LOG_LEVELS.INFO;

function log(level, message, data) {
    if (level > currentLevel) return;
    
    const levelName = Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level);
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] [${levelName}] ${message}`);
    if (data) console.log('  Data:', data);
}

module.exports = {
    setLevel: (level) => { currentLevel = level; },
    error: (msg, data) => log(LOG_LEVELS.ERROR, msg, data),
    warn: (msg, data) => log(LOG_LEVELS.WARN, msg, data),
    info: (msg, data) => log(LOG_LEVELS.INFO, msg, data),
    debug: (msg, data) => log(LOG_LEVELS.DEBUG, msg, data)
};
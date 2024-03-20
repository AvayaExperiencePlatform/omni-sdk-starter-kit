/**
 * LogFormatter which returns a log string in the format - 
 * [<level>] (sample-token-server @ <timestamp>) :: <log message>.
 * 
 * Each method takes a string message and returns a formatted string.
 */
export const LogFormat = {

    /**
     * @param {string} message 
     * @returns {string}
     */
    trace(message) {
        return `[TRACE] (sample-token-server @ ${(new Date()).toISOString()}) :: ${message}`;
    },

    /**
     * @param {string} message 
     * @returns {string}
     */
    info(message) {
        return `[INFO] (sample-token-server @ ${(new Date()).toISOString()}) :: ${message}`;
    },

    /**
     * @param {string} message 
     * @returns {string}
     */
    warn(message) {
        return `[WARN] (sample-token-server @ ${(new Date()).toISOString()}) :: ${message}`;
    },

    /**
     * @param {string} message 
     * @returns {string}
     */
    error(message) {
        return `[ERROR] (sample-token-server @ ${(new Date()).toISOString()}) :: ${message}`;
    },
    
    /**
     * @param {string} message 
     * @returns {string}
     */
    fatal(message) {
        return `[FATAL] (sample-token-server @ ${(new Date()).toISOString()}) :: ${message}`;
    }
}
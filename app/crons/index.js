const cryptoCron = require('./crypto_cron');
const twitterCron = require('./twitter_cron');
const historicalCron = require('./historical_cron');

module.exports = function (db) {
    // cryptoCron(db);
    twitterCron(db);
    historicalCron(db);
    // Other route groups could go here, in the future
};
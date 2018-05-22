const cryptoCron = require('./crypto_cron');
const twitterCron = require('./twitter_cron');

module.exports = function (db) {
    // cryptoCron(db);
    twitterCron(db);
    // Other route groups could go here, in the future
};
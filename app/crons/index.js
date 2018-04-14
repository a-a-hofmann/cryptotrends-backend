const cryptoCron = require('./crypto_cron');
const twitterCron = require('./twitter_cron');

module.exports = function (app, db) {
    cryptoCron(app, db);
    twitterCron(app, db);
    // Other route groups could go here, in the future
};
const CronJob = require('cron').CronJob;
const { fetchTweets } = require('../services');

module.exports = function (db) {
    new CronJob('00 55 23 * *', function () {
        console.log('TWITTER CRON::STARTED');
        fetchTweets(db);
    }, null, true, 'Europe/Zurich');
};
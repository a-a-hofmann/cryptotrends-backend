const CronJob = require('cron').CronJob;
const { fetchTweets } = require('../services');

module.exports = function (db) {
    new CronJob('00 55 23 * * *', function () {
        const nextExecution = this.nextDates().toString();
        console.log('TWITTER CRON::STARTED Will fire again at: ' + nextExecution);
        fetchTweets(db);
    }, null, true, 'Europe/Zurich');
};
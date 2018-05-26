const CronJob = require('cron').CronJob;
const { fetchTweets } = require('../services');
const chalk = require('chalk');

module.exports = function (db) {
    let job = new CronJob('00 55 23 * * *', function () {
        let nextExecution = this.nextDates().toString();
        console.log('TWITTER CRON::STARTED. Will fire again at: ' + nextExecution);
        fetchTweets(db);
    }, null, true, 'Europe/Zurich');

    let nextExecution = job.nextDates().toString();
    console.log(chalk.green('TWITTER CRON::REGISTERED. Will fire at: ' + nextExecution));
};
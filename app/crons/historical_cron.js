const CronJob = require('cron').CronJob;
const { fetchHistoricalData } = require('../services');
const chalk = require('chalk');

module.exports = function (db) {
    const historicalCollection = db.collection('historical');

    const job = new CronJob('00 55 23 * * *', function () {
        let nextExecution = this.nextDates().toString();
        console.log('HISTORICAL CRON::STARTED. Will fire again at: ' + nextExecution);
        historicalCollection.drop(function (err, delOK) {
            if (delOK) {
                fetchHistoricalData(db);
            }
        });
    }, null, true, 'Europe/Zurich');

    let nextExecution = job.nextDates().toString();
    console.log(chalk.green('HISTORICAL CRON::REGISTERED. Will fire at: ' + nextExecution));
};

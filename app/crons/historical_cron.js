const CronJob = require('cron').CronJob;
const { fetchHistoricalData } = require('../services');

module.exports = function (db) {
    const historicalCollection = db.collection('historical');

    new CronJob('00 55 23 * * *', function () {
        const nextExecution = this.nextDates().toString();
        console.log('HISTORICAL CRON::STARTED Will fire again at: ' + nextExecution);
        historicalCollection.drop(function (err, delOK) {
            if (delOK) {
                fetchHistoricalData(db);
            }
        });
    }, null, true, 'Europe/Zurich');
};

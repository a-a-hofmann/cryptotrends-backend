const CronJob = require('cron').CronJob;
const { fetchHistoricalData } = require('../services');

module.exports = function (db) {
    const historicalCollection = db.collection('historical');

    new CronJob('00 55 23 * * *', function () {
        historicalCollection.drop(function (err, delOK) {
            if (delOK) {
                fetchHistoricalData(db);
            }
        });
    }, null, true, 'Europe/Zurich');
};

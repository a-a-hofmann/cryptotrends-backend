const CronJob = require('cron').CronJob;
const {fetchTweets}  = require('../services');

module.exports = function (app, db) {
	new CronJob('* * 0 * *', function () {
		console.log("TWITTER CRON::STARTED");
        fetchTweets(db);
	}, null, true, 'Europe/Zurich');
};
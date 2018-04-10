const CronJob = require('cron').CronJob;
const Twit = require('twit');
const TWITTER_KEY = require(process.cwd() + "/" + process.env.TWITTER_APPLICATION_CREDENTIALS);

module.exports = function (app, db) {
	var T = new Twit(
		TWITTER_KEY
	//{timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
	);

	let twitCollection = db.collection('raw_twits');

	new CronJob('* * 0 * *', function () {
		console.log("TWITTER CRON::STARTED");
		//console.log(app);

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		var dateTime = yyyy + "-" + mm + "-" + (dd - 1);

		T.get('search/tweets', { q: '#crypto since:' + dateTime, count: 999999, language: 'en'}, function(err, data, response) {
		    //console.log(data);
		    twitCollection.insertMany(data.statuses);
		    console.log("TWITTER CRON::INSERTED");
		})

	}, null, true, 'Europe/Zurich');
};
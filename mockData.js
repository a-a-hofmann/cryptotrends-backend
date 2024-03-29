require('dotenv').load();
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;

function randomMagnitude() {
	return getRandomArbitrary(0, 200);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomScore() {
	return getRandomArbitrary(-1, 1);
}

const symbols = ['BTC', 'ETH', 'LTC', 'BCH'];

const dates = [];
for (let i = 1; i < 600; i++) {
	const dateFrom = moment(moment().subtract(i, 'd').format('YYYY-MM-DD')).toDate();
	dates.push(dateFrom);
}

MongoClient.connect(process.env.MONGODB_URI, async (err, db) => {
	if (err) throw err;

	const sentimentCollection = db.collection('sentiment_score');
	await sentimentCollection.drop();

	promises = [];
	dates.forEach(date => {
		const data = [];
        symbols.forEach(symbol => {
			data.push({
				magnitude: randomMagnitude(),
				score: getRandomScore(),
				symbol,
				numberOfTweets: Math.ceil(getRandomArbitrary(20, 200)),
				date,
			})
		});

		promises.push(sentimentCollection.insertMany(data));
	});

	Promise.all(promises).then(res => {
		console.log("Done");
		process.exit()
	});
});

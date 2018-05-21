function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomMagnitude() {
	return getRandomArbitrary(0, 200);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomScore() {
	return getRandomArbitrary(-1, 1);
}

const symbols = ['BTC', 'ETH', 'LTC', 'BCH']

const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;

const dates = [];
for (let i = 0; i < 28; i++) {
	const dateFrom = moment().subtract(i, 'd').format('YYYY-MM-DD');	
	dates.push(dateFrom);
}

MongoClient.connect('mongodb://localhost:27017/crypto-trends', (err, database) => {
	if (err) throw err;

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

		database.collection('sentiment_score').insertMany(data)
	});
});

console.log("Done");
process.exit();
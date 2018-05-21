function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomMagnitude() {
	return getRandomInt(200);
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

const today = moment();

const dates = [today.format('YYYY-MM-DD')];
for (let i = 1; i < 28; i++) {
	const dateFrom = moment().subtract(i, 'd').format('YYYY-MM-DD');	
	dates.push(dateFrom);
}

MongoClient.connect('mongodb://localhost:27017/crypto-trends', (err, database) => {
	if (err) throw err;

	symbols.forEach(symbol => {

		const data = [];

		dates.forEach(date => {
			data.push({
				symbol,
				date,
				magnitude: randomMagnitude(),
				score: getRandomScore()
			})
		});

		console.log(dates);
		database.collection('sentiment_score').insertMany(data)
	});
});

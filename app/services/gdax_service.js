const chalk = require('chalk');
const Candle = require('./Candle.js');
const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();
const moment = require('moment');
const { HISTORICAL_COLLECTION, PAIRS, SYMBOLS } = require('../utils/Constants');

// granularity of each data point: 86400 -> daily, from start to end.
function fetchDailyRateForSymbol (symbol, start, end) {
    const secondsInADay = 86400;
    const params = {
        start: start,
        end: end,
        granularity: secondsInADay
    };
    return publicClient.getProductHistoricRates(symbol, params);
}

// syntactic sugar to await on promises.
function on (promise) {
    return promise
        .then(result => [null, result])
        .catch(error =>  [error]);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

module.exports = {
    async fetchHistoricalData(db) {
        const today = moment(new Date());
        const threeHundredDaysAgo = moment(new Date()).subtract(300, 'days');
        const sixHundredDaysAgo = moment(new Date()).subtract(600, 'days');
        
        let historicalCollection = db.collection(HISTORICAL_COLLECTION);

        console.log(chalk.cyan(`GDAX SERVICE::Fetching values for pairs. Going up to 600 days ago`));
        for (let i = 0; i < PAIRS.length; i++) {
            const pair = PAIRS[i];
            const symbol = SYMBOLS[i];

            let err, historicalDataUpTo300DaysAgo, historicalData300To600DaysAgo;

            console.log(chalk.cyan(`GDAX SERVICE::Fetching pair: ${pair}.`));
            
            // Need to throttle requests. GDAX allows up to 3 per second. So might as well await for the data to arrive.
            [err, historicalDataUpTo300DaysAgo] = await on(fetchDailyRateForSymbol(pair, threeHundredDaysAgo.toISOString(), today.toISOString()));
            if (err) {
                console.log(chalk.red(err));
                throw err;
            }
            historicalDataUpTo300DaysAgo = historicalDataUpTo300DaysAgo.map(dataPoint => new Candle(symbol, dataPoint));

            console.log(chalk.cyan('Throttling requests...'));
            await sleep(333);

            [err, historicalData300To600DaysAgo] = await on(fetchDailyRateForSymbol(pair, sixHundredDaysAgo.toISOString(), threeHundredDaysAgo.toISOString()));
            if (err) {
                console.log(chalk.red(err));
                throw err;
            }

            historicalData300To600DaysAgo = historicalData300To600DaysAgo.map(dataPoint => new Candle(symbol, dataPoint));
            
            const historicalData = historicalDataUpTo300DaysAgo;
            historicalData.push(...historicalData300To600DaysAgo);
            if (historicalData.length > 0) {
                historicalCollection.insertMany(historicalData, function(err, r) {
                    if (err) console.log(chalk.red(err));;
                });
            }
            await sleep(333);
        }
    },
    getHistoricalTimeseries(db) {
        const timeseries = [];
        for (let i = 0; i < SYMBOLS.length; i++) {
            const symbol = SYMBOLS[i];

            db.collection('cryptos').find({})

            timeseries.push(db.collection('historical').find({symbol: symbol}).toArray());
        }

        return Promise.all(timeseries);
    }
}
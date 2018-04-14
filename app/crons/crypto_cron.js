const CronJob = require('cron').CronJob;
const https = require('https');
const COIN_MARKET_CAP_API_ENDPOINT = 'api.coinmarketcap.com';

module.exports = function (db) {
    let cryptoCollection = db.collection('cryptos');

    new CronJob('*/1 * * * *', function () {
        console.log('CRYPTO CRON::STARTED');

        console.log('CRYPTO CRON::DROPPING COLLECTION');
        cryptoCollection.drop(function (err, delOK) {
            if (err) throw err;
            if (delOK) {
                console.log('CRYPTO CRON::COLLECTION DROPPED');

                const options = {
                    host: COIN_MARKET_CAP_API_ENDPOINT,
                    path: '/v1/ticker/',
                    method: 'GET'
                };

                console.log('CRYPTO CRON::FETCHING CRYPTOS');
                https.request(options, function (res) {

                    let data = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', function () {
                        let objs = JSON.parse(data);
                        cryptoCollection.insertMany(objs);
                        console.log('CRYPTO CRON::INSERTING CRYPTOS');
                    });
                }).end(function () {
                    console.log('CRYPTO CRON::DONE');
                });

            }
        });
    }, null, true, 'Europe/Zurich');
};
const { HISTORICAL_COLLECTION } = require('../utils/Constants');
const {getHistoricalTimeseries} = require('../services');
const moment = require('moment');


module.exports = function (app, db) {
    app.get('/crypto', (req, res) => {
        db.collection('cryptos').find({}).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');
            res.send(result);
        });
    });

    app.get('/historical', (req, res) => {
        const symbol = req.query.symbol || '';
        const params = {};
        if (symbol) {
            params.symbol = symbol.toUpperCase();
        }

        db.collection(HISTORICAL_COLLECTION).find(params).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');
            res.send(result);
        });
    });

    app.get('/timeseries', (req, res) => {
        getHistoricalTimeseries(db).then(result => {
            const results = result[0];
            const response = {};

            for (let i = 0; i < result.length; i++) {
                const symbolValues = result[i] || [];
                if (symbolValues.length > 0) {
                    const symbol = symbolValues[0].symbol;
                    response[symbol] = symbolValues.map(value => {
                        const time = moment(value.timestamp);
                        return {
                            timestamp: time.format('DD-MM-YYYY'),
                            week: time.week(),
                            month: time.month() + 1,
                            value: value.close
                    }});
                }
            }
            res.contentType('application/json');
            res.send(response);
        });
    });

    app.post('/scores', (req, res) => {
        const date = req.body.date;
        const symbol = req.body.symbol;

        db.collection('sentiment_score').find({date, symbol}).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');
            res.send(result);
        });
    })
};
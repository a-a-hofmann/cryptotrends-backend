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
        const body = req.body;
        const date = moment(body.date).toDate();
        const from = moment(body.from).toDate();
        const to = moment(body.to).toDate();
        const symbol = body.symbol;
    
        // Find by either date or by range.
        db.collection('sentiment_score').find({ 
            symbol,
            $or: [ 
                {
                    $and: [ {'date': {$lte: to}}, {'date' : {$gte: from}}]
                }, 
                {
                    date
                }
            ],
        }).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');

            result.sort((a, b) => {
                return b.date - a.date;
            })
            res.send(result);
        });
    })
}
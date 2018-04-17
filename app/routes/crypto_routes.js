const { HISTORICAL_COLLECTION } = require('../utils/Constants');

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
};
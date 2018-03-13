// routes/crypto_routes.js
const services = require('../services');

module.exports = function (app, db) {

    app.get('/crypto', (req, res) => {

        db.collection("cryptos").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');
            res.send(result);
        });

    });

    // Uses google's NLP API and returns the results to the user
    app.post('/sentiment', (req, res) => {
        const textRecord = req.body.text;
        services.sentimentAnalysis(app, textRecord).then(results => {
            res.send(results);
        });
    });
};
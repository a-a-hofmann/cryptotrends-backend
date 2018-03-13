// routes/crypto_routes.js

module.exports = function (app, db) {

    app.get('/crypto', (req, res) => {

        db.collection("cryptos").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');
            res.send(result);
        });

    });
};
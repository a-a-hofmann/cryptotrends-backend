// routes/raw_twits_routes.js

module.exports = function (app, db) {

    app.get('/raw_twits', (req, res) => {

        db.collection("raw_twits").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');
            res.send(result);
        });

    });
};
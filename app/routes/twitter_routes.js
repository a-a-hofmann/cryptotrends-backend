module.exports = function (app, db) {
    app.get('/tweets', (req, res) => {
        db.collection('tweets').find({}).toArray(function (err, result) {
            if (err) throw err;
            res.contentType('application/json');
            res.send(result);
        });
    });
};
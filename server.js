require('dotenv').load();

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const port = process.env.PORT || 8000;

// init database
MongoClient.connect(process.env.MONGODB_URI, (err, database) => {

    if (err) return console.log(err);

    // init router
    require('./app/routes')(app, database);

    // init crons
    require('./app/crons')(app, database);

    // start server
    app.listen(port, () => {
        console.log('Started Server at port: ' + port);
    });
});
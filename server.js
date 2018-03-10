require('dotenv').load();

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const port = process.env.SERVER_PORT;

// init database
MongoClient.connect(process.env.DB_URL, (err, database) => {

    if (err) return console.log(err);

    // init router
    require('./app/routes')(app, database);

    // init crons
    require('./app/crons')(app, database);

    // start server
    app.listen(port, () => {
        console.log('Started Server at port' + port);
    });
});
require('dotenv').load();

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.json());

// init database
MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
    if (err) return console.log(err);

    // init router
    require('./app/routes')(app, database);

    // init crons
    require('./app/crons')(database);

    // start server
    app.listen(port, () => {
        console.log('Started Server at port: ' + port);
    });
});
require('dotenv').load();

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

// init database
MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
    if (err) return console.log(err);

    // init router
    require('./app/routes')(app, database);

    // init crons
    require('./app/crons')(database);

    database.collection('historical').drop((error, delOk) => {
        // start server
        app.listen(port, () => {
            console.log('Started Server at port: ' + port);
        });
    })
});
const chalk = require('chalk');
const services = require('../services');
const {fetchHistoricalData} = require('../services');

// These routes are hidden in production. Set environment variable MODE
// to 'dev' in order to register these
module.exports = function (app, db) {
    if (process.env.MODE === 'dev') {
        console.log(chalk.yellow('DEV ROUTES::WARNING: Registering dev routes.'));
        
        console.log(chalk.cyan('Initializing historical data...'));
        fetchHistoricalData(db).then(() => console.log(chalk.green('Finished initializing historical data.')));

        // Uses google's NLP API and returns the results to the user, 
        // should hide this in production to avoid users abusing this.
        app.post('/sentiments', (req, res) => {
            const textRecord = req.body.text;
            services.simpleAnalysis(textRecord).then(results => {
                res.send({ result: results });
            });
        });

        app.post('/tweets', (req, res) => {
            services.fetchTweets(db);
            res.send('Started fetching tweets.');
        });

        app.post('/historical', (req, res) => {
            fetchHistoricalData(db);
            res.send('Fetching historical');
        });
    }
};
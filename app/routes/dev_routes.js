// routes/dev_routes.js
const services = require('../services');

// These routes are hidden in production. Set environment variable MODE
// to 'dev' in order to register these
module.exports = function (app, db) {
    
    if (process.env.MODE === 'dev') {
        console.log("WARNING: Registering dev routes.");
        
        // Uses google's NLP API and returns the results to the user, 
        // should hide this in production to avoid users abusing this.
        app.post('/sentiments', (req, res) => {
            const textRecord = req.body.text;
            services.simpleAnalysis(app, textRecord).then(results => {
                res.send({result: results});
            });
        });

        app.post('/tweets', (req, res) => {
            services.fetchTweets(db);
            res.send("Started fetching tweets.");
        });
    }
};
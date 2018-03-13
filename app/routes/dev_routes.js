// routes/dev_routes.js
const services = require('../services');

// These routes are hidden in production. Set environment variable MODE
// to 'dev' in order to register these
module.exports = function (app) {
    
    if (process.env.MODE === 'dev') {
        
        // Uses google's NLP API and returns the results to the user, 
        // should hide this in production to avoid users abusing this.
        app.post('/sentiments', (req, res) => {
            const textRecord = req.body.text;
            services.simpleAnalysis(app, textRecord).then(results => {
                res.send({result: results});
            });
        });
    }
};
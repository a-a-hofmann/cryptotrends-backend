// routes/index.js
const cryptoCron = require('./crypto_cron');

module.exports = function (app, db) {
    cryptoCron(app, db);
    // Other route groups could go here, in the future
};
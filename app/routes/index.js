const cryptoRoutes = require('./crypto_routes');
const rawTwitsRoutes = require('./twitter_routes');
const devRoutes = require('./dev_routes');

module.exports = function (app, db) {
    cryptoRoutes(app, db);
    rawTwitsRoutes(app, db);
    devRoutes(app, db);
    // Other route groups could go here, in the future
};
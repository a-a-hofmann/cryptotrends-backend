// routes/index.js
const cryptoRoutes = require('./crypto_routes');
const devRoutes = require('./dev_routes');

module.exports = function (app, db) {
    cryptoRoutes(app, db);
    devRoutes(app);
    // Other route groups could go here, in the future
};
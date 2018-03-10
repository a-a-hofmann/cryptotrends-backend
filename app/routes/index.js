// routes/index.js
const cryptoRoutes = require('./crypto_routes');

module.exports = function (app, db) {
    cryptoRoutes(app, db);
    // Other route groups could go here, in the future
};
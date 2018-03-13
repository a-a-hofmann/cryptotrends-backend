// services/index.js
const sentimentService = require('./sentiment_service');

module.exports = {
    sentimentAnalysis: (app, text) => sentimentService.analyze(app, text),
    simpleAnalysis: (app, text) => sentimentService.simpleAnalysis(app, text)
};
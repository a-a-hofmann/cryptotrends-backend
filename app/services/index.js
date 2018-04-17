const sentimentService = require('./sentiment_service');
const twitterService = require('./twitter_service');
const gdaxService = require('./gdax_service');

module.exports = {
    sentimentAnalysis: (text) => sentimentService.analyze(text),
    simpleAnalysis: (text) => sentimentService.simpleAnalysis(text),
    fetchTweets: (db) => twitterService.fetchTweets(db),
    fetchHistoricalData: (db) => gdaxService.fetchHistoricalData(db)
};
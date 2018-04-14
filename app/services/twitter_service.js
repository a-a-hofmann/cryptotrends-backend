const Twit = require('twit');
const TWITTER_KEY = require(process.cwd() + '/' + process.env.TWITTER_APPLICATION_CREDENTIALS);

const T = new Twit(
    TWITTER_KEY
//{timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
);

module.exports = {
    fetchTweets: (db) => {
        const twitCollection = db.collection('raw_twits');
        const today = new Date().toISOString().slice(0, 10);

        T.get('search/tweets', {
            q: '#crypto since:' + today,
            count: 999999,
            language: 'en'
        }, function (err, data, res) {
            twitCollection.insertMany(data.statuses);
            console.log('TWITTER SERVICE::INSERTED');
        });
    }
};
const Twit = require('twit');
const TWITTER_KEY = require(process.cwd() + '/' + process.env.TWITTER_APPLICATION_CREDENTIALS);

const TwitClient = new Twit(TWITTER_KEY);

module.exports = {
    fetchTweets: (db) => {
        const tweetCollection = db.collection('tweets');
        const today = new Date().toISOString().slice(0, 10);

        TwitClient.get('search/tweets', {
            q: '#crypto since:' + today,
            count: 999999,
            language: 'en'
        }, function (err, data, res) {
            tweetCollection.insertMany(data.statuses);
            console.log('TWITTER SERVICE::INSERTED');
        });
    }
};
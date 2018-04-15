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
            // prune statuses: only keep fields required for analysis
            const statuses = data.statuses.map(
                ({
                    text,
                    retweet_count,
                    favorite_count,
                    user: {
                        followers_count,
                        friends_count
                    }
                }) => ({
                    text,
                    retweet_count,
                    favorite_count,
                    user: {
                        followers_count,
                        friends_count
                    },
                    relevance: calculateRelevance(
                        retweet_count,
                        favorite_count,
                        followers_count,
                        friends_count
                    )
                })
            );
            tweetCollection.insertMany(statuses);
            console.log('TWITTER SERVICE::INSERTED');
        });
    }
};

const calculateRelevance = (
    retweet_count,
    favorite_count,
    followers_count,
    friends_count
) => (0.25 * (retweet_count + favorite_count + followers_count + friends_count));

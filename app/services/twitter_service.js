const { simpleAnalysis } = require('./sentiment_service');
const Twit = require('twit');
const TWITTER_KEY = require(process.cwd() + '/' + process.env.TWITTER_APPLICATION_CREDENTIALS);

const TwitClient = new Twit(TWITTER_KEY);

module.exports = {
    fetchTweets: (db) => {
        const tweetCollection = db.collection('tweets');
        const today = new Date().toISOString().slice(0, 10);
        const tags = ['#crypto'];

        tags.forEach((tag) => {
            TwitClient.get('search/tweets', {
                q: `${tag} since:${today}`,
                count: 999999,
                language: 'en'
            }, async function (err, data, res) {
                let statuses = data.statuses.map(
                    ({
                        created_at,
                        text,
                        retweet_count,
                        favorite_count,
                        user: {
                            followers_count,
                            friends_count
                        }
                    }) => ({
                        created_at,
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
                let scores = statuses.map(({ text }) => simpleAnalysis(text));
                scores = await Promise.all(scores);
                statuses = statuses.map(({ ...props }, i) => ({ ...props, score: scores[i] }));
                tweetCollection.insertMany(statuses);
                console.log('TWITTER SERVICE::INSERTED');
            });
        });
    }
};

const calculateRelevance = (
    retweet_count,
    favorite_count,
    followers_count,
    friends_count
) => (0.25 * (retweet_count + favorite_count + followers_count + friends_count));

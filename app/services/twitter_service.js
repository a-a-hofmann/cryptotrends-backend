const Twit = require('twit');
const TWITTER_KEY = require(process.cwd() + '/' + process.env.TWITTER_APPLICATION_CREDENTIALS);
const { TAGS } = require('../utils/Constants');

const TwitClient = new Twit(TWITTER_KEY);

module.exports = {
    fetchTweets: (db) => {
        const tweetCollection = db.collection('tweets');
        const today = new Date().toISOString().slice(0, 10);

        Object.keys(TAGS).forEach((symbol) => {
            TAGS[symbol].forEach((tag) => {
                TwitClient.get('search/tweets', {
                    q: `#${tag} since:${today}`,
                    count: 999999,
                    language: 'en'
                }, async function (err, data, res) {
                    let statuses = data.statuses.map(
                        ({
                             id,
                             created_at,
                             text,
                             retweet_count,
                             favorite_count,
                             user: {
                                 followers_count,
                                 friends_count
                             },
                            entities: {
                                 hashtags
                            }
                         }) => ({
                            symbol,
                            id,
                            created_at,
                            text,
                            retweet_count,
                            favorite_count,
                            user: {
                                followers_count,
                                friends_count
                            },
                            num_hashtags: hashtags.length,
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

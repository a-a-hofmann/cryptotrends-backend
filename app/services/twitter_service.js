const Twit = require('twit');
const TWITTER_KEY = require(process.cwd() + '/' + process.env.TWITTER_APPLICATION_CREDENTIALS);
const { TAGS, TWEET_LENGTH_THRESHOLD } = require('../utils/Constants');
const { analyze } = require('./sentiment_service');
const chalk = require('chalk');
const moment = require('moment');

const TwitClient = new Twit(TWITTER_KEY);

module.exports = {
    fetchTweets: (db) => {
        const tweetCollection = db.collection('tweets');
        const today = new Date().toISOString().slice(0, 10);

        Object.keys(TAGS).forEach((symbol) => {
            const symbolPromises = TAGS[symbol].map((tag) => {
                const promise = TwitClient.get('search/tweets', {
                    q: `#${tag} since:${today}`,
                    count: 999999,
                    language: 'en'
                });
                return promise
                .then(result => {
                    const data = result.data;
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
                    ).filter(tweet => filterTweet(tweet));
                    tweetCollection.insertMany(statuses);
                    console.log('TWITTER SERVICE::INSERTED');
                    return statuses;
                })
                .catch(error => console.log(error));
            });

            Promise.all(symbolPromises).then(async (result) => {
                let tweetsForSymbol = [];
                for (let i = 0; i < result.length; i++) {
                    tweetsForSymbol = tweetsForSymbol.concat(result[i]);
                }

                const tweetBlob = tweetsForSymbol.map(tweet => tweet.text).reduce((tweet1, tweet2) => tweet1 + '\n' + tweet2);
                console.log("Starting analysis for symbol: " + symbol);
                console.log("Analyzing " + tweetsForSymbol.length + " tweets.\n" + tweetBlob.length / 1000 + " text records.");
                const analysisResult = await on(analyze(tweetBlob).then(result => {
                    return {
                        ...result.documentSentiment,
                        symbol,
                        numberOfTweets: tweetsForSymbol.length,
                        date: today()
                    }
                }));

                const sentimentScoreCollection = db.collection('sentiment_score');
                sentimentScoreCollection.insert(analysisResult);
                console.log('TWITTER SERVICE SENTIMENT SCORE::INSERTED');

            }).catch(error => console.log(chalk.red(error)));
        });
    }
};

const today = () => moment().format('YYYY-MM-DD');

const calculateRelevance = (
    retweet_count,
    favorite_count,
    followers_count,
    friends_count
) => (0.25 * (retweet_count + favorite_count + followers_count + friends_count));

const filterTweet = (tweet) => {
    const tokens = tweet.text.split(" ");
    return tokens.length > TWEET_LENGTH_THRESHOLD && 2 * tweet.num_hashtags < tokens.length;
}

// syntactic sugar to await on promises.
function on (promise) {
    return promise
        .then(result => result)
        .catch(error =>  {
            console.log(chalk.red(error));
            return [error]
        });
}

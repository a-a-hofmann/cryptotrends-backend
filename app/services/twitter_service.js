const Twit = require('twit');
const TWITTER_KEY = require(process.cwd() + '/' + process.env.TWITTER_APPLICATION_CREDENTIALS);
const { TAGS, TWEET_LENGTH_THRESHOLD } = require('../utils/Constants');
const { analyze } = require('./sentiment_service');
const chalk = require('chalk');
const math = require('mathjs');

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
                const analysisResult = await on(analyzeTweet(tweetBlob));
                console.log(analysisResult);
                analyze(tweetBlob).then(result => {
                    const scores = result.sentences
                        .map(sentence => sentence.sentiment.score)
                        .filter(score => notAlmostZero(score));

                    if (scores.length === 0) {
                        console.log(chalk.red("Empty array for symbol: " + symbol));
                    } else {

                    
                    
                    const norm = Math.sqrt(scores.reduce((accumulator, score) => accumulator + score**2, 0));
                    const normalizedScores = scores.map(score => score / norm);

                    const median = math.median(normalizedScores);
                    const mean = math.mean(normalizedScores);
                    const max = math.max(normalizedScores);
                    const min = math.min(normalizedScores);

                    console.log(chalk.cyan("Symbol: " + symbol));
                    console.log(chalk.yellow("Median: " + median));
                    console.log(chalk.yellow("Average: " + mean));
                    console.log(chalk.yellow("Max: " + max));
                    console.log(chalk.yellow("Min: " + min));
                    console.log("\n----------------\n")

                    }
                });


            }).catch(error => console.log(chalk.red(error)));
        });
    }
};

const notAlmostZero = (value) => {
    const epsilon = 0.0001;
    return Math.abs(value) > epsilon;
}

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

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
        .then(result => [null, result])
        .catch(error =>  [error]);
}

function analyzeTweet(tweetBlob) {
    return analyze(tweetBlob).then(result => {
        const scores = result.sentences
            .map(sentence => sentence.sentiment.score)
            .filter(score => score === 0);

        if (scores.length === 0) {
            console.log(chalk.red("Empty array for symbol: " + symbol));
        } else {

        
        
        const norm = Math.sqrt(scores.reduce((accumulator, score) => accumulator + score**2, 0));
        const normalizedScores = scores.map(score => score / norm);

        const median = math.median(normalizedScores);
        const mean = math.mean(normalizedScores);
        const max = math.max(normalizedScores);
        const min = math.min(normalizedScores);

        console.log(chalk.cyan("Symbol: " + symbol));
        console.log(chalk.yellow("Median: " + median));
        console.log(chalk.yellow("Average: " + mean));
        console.log(chalk.yellow("Max: " + max));
        console.log(chalk.yellow("Min: " + min));
        console.log("\n----------------\n")
        }
    });
}
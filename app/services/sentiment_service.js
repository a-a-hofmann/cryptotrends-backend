const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const self = module.exports = {
    analyze: (textRecord) => {

        const document = {
            content: textRecord,
            type: 'PLAIN_TEXT',
        };

        return client
            .analyzeSentiment({ document: document })
            .then(results => {
                console.log('---------\nText record results:');

                const result = results[0];
                const documentSentiment = result.documentSentiment;
                logResults(textRecord, documentSentiment.score, documentSentiment.magnitude);

                console.log('---------\nIterating over each sentence\n');
                result.sentences.forEach(sentence => {
                    const text = sentence.text.content;
                    const sentiment = sentence.sentiment;
                    logResults(text, sentiment.score, sentiment.magnitude);
                });

                // Append original query to the results
                result.query = textRecord;
                return result;
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    },
    simpleAnalysis: (textRecord) => {
        return self.analyze(textRecord).then(result => {
            const googleScore = result.documentSentiment.score;
            const score = 4 * (googleScore + 1) / 2 + 1;
            return score;
        });
    }
};

const logResults = (text, score, magnitude) => {
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${score}`);
    console.log(`Sentiment magnitude: ${magnitude}`);
};
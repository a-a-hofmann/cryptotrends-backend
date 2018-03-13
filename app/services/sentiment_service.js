// services/sentiment_service.js
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

module.exports.analyze = function (app, textRecord) {
    
    const document = {
        content: textRecord,
        type: 'PLAIN_TEXT',
      };
      
      return client
        .analyzeSentiment({document: document})
        .then(results => {
            console.log('---------\nText record results:');

            const result = results[0];
            const documentSentiment = result.documentSentiment;
            logResults(textRecord, documentSentiment.score, documentSentiment.magnitude);

            console.log("---------\nIterating over each sentence\n");
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
};

const logResults = (text, score, magnitude) => {
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${score}`);
    console.log(`Sentiment magnitude: ${magnitude}`);
}
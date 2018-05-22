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
                const result = results[0];
                const documentSentiment = result.documentSentiment;
                
                // Append original query to the results
                result.query = textRecord;
                return result;
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

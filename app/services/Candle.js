// Candle.js
const moment = require('moment');

module.exports = class Candle {
    constructor(symbol, data) {
        this.timestamp = moment.unix(data[0]).toISOString();
        this.low = data[1];
        this.high = data[2];
        this.open = data[3];
        this.close = data[4];
        this.volume = data[5];
        this.symbol = symbol;
    }
}
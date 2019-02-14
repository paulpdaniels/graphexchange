const {SEDataSource} = require('./base');

class AnswersAPI extends SEDataSource {
  constructor (key) { super(key, 'answers'); }
}

module.exports = AnswersAPI;

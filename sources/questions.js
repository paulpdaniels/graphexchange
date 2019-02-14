const {SEDataSource} = require('./base');

class QuestionsAPI extends SEDataSource {
  constructor(key) { super(key, 'questions'); }
}

module.exports = QuestionsAPI;

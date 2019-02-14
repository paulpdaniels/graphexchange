const {SEDataSource} = require('./base');

class BadgesAPI extends SEDataSource {
  constructor(key) {
    super(key, 'badges');
  }
}

module.exports = BadgesAPI;

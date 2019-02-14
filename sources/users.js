const {SEDataSource} = require('./base');
const R = require('ramda');

class MeDataSource extends SEDataSource {
  constructor(key) {
    super(key, 'me');
  }

  async getMe(rest) {
    const {path} = this;
    const params = this.buildRequest(rest);
    return this.get(`/${path}`, params).then(({items}) => R.head(items))
  }
}

module.exports = MeDataSource;

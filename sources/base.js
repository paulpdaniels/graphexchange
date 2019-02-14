const {RESTDataSource} = require('apollo-datasource-rest');
const {buildParams} = require('./helpers');

class SEDataSource extends RESTDataSource {
  constructor (key, path, version = '2.2') {
    super();
    this.baseURL = `https://api.stackexchange.com/${version}`;
    this.path = path;
    this.key = key;
  }

  willSendRequest(request) {
    request.params.set('key', this.key);
    this.context.access_token && request.params.set('access_token', this.context.access_token);
  }

  buildRequest(params) {
    return buildParams(params);
  }

  async getAll({ids, ...rest}) {
    const {path} = this;
    const params = buildParams(rest);
    return ids
      ? this.get(`/${path}/${String.join(';', ids)}`, params)
      : this.get(`/${path}`, params);
  }
}

module.exports = {SEDataSource};

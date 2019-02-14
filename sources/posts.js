const {SEDataSource} = require('./base');


class PostsAPI extends SEDataSource {
  constructor (key) {
    super(key, 'posts');
  }
}

module.exports = PostsAPI;

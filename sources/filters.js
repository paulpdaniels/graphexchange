const {SEDataSource} = require('./base')

class FilterDataSource extends SEDataSource {
  constructor(key) {
    super(key, 'filters')
  }

  async create() {

  }
}

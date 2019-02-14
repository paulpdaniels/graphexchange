const {pick, pickBy, identity, compose} = require('ramda');

const standardParams = [
  'page',
  'pagesize',
  'order',
  'sort',
  'min',
  'max',
  'site',
  'fromdate',
  'todate',
  'key'
];

module.exports = {
  buildParams (obj) {
    return compose(pick(standardParams), pickBy(identity))(obj);
  }

};

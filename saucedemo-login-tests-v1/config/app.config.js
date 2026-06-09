const users = require('../data/users');
const urls = require('../data/urls');

module.exports = {
  baseURL: urls.base,
  timeouts: {
    navigation: 60000,
    action: 15000,
  },
  users,
  urls,
};

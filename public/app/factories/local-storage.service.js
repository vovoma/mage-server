var angular = require('angular');

module.exports = 'LocalStorageService';

angular
  .module('mage')
  .factory(module.exports, LocalStorageService);

LocalStorageService.$inject = [];

function LocalStorageService() {
  var tokenKey = 'token';

  var service = {
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken
  };

  return service;

  function getToken() {
    return getLocalItem(tokenKey);
  }

  function setToken(token) {
    return setLocalItem(tokenKey, token);
  }

  function removeToken() {
    return removeLocalItem(tokenKey);
  }

  function getLocalItem(key) {
    try {
      if ('localStorage' in window && window['localStorage'] !== null) {
        return localStorage.getItem(key);
      }
    } catch (e) {
      return false;
    }
  }

  function setLocalItem(key, value) {
    try {
      if ('localStorage' in window && window.localStorage !== null) {
        return localStorage.setItem(key, value);
      }
    } catch (e) {
      return false;
    }
  }

  function removeLocalItem(key) {
    try {
      if ('localStorage' in window && window.localStorage !== null) {
        return localStorage.removeItem(key);
      }
    } catch (e) {
      return false;
    }
  }
}


// const ShaFn = require('./sha.js');
// const Sha1 = ShaFn();

var Sha1 = require('./sha1/sha1.js');


// 配置请求头
const setHeaders = function (url = '', data = {}) {
  let headers = {
    "dfsx-authorize": {}
  };
  let header_array = (function (url) {
    var result = {};
    var query = url.split("?");
    if (query.length === 1) {
      return result;
    }
    query = query[1];
    var queryArr = query.split("&");
    queryArr.forEach(function (item) {
      var value = item.split("=")[1];
      var key = item.split("=")[0];
      result[key] = value;
    });
    return result;
  })(url);
  let header_config = {
    "client_id": "0004",
    "client_key": "42280accf357f86bf00fff62042087c4deb9d6e0"
  };
  let headers_opt = {
    "clientId": header_config.client_id,
    "stamp": Math.round((new Date()).getTime() / 1000)
  };
  let key_arr = [];
  let sign = '';

  for (var key in headers_opt) {
    header_array[key] = headers_opt[key];
  }
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      header_array[key] = data[key];
    }
  }
  for (var key in header_array) {
    key_arr.push(key);
  }
  key_arr.sort();
  for (var key in key_arr) {
    sign += "&" + key_arr[key] + "=" + header_array[key_arr[key]];
  }
  sign += header_config.client_key;
  // console.log(sign, sha1(sign.substr(1)).toUpperCase(), 'headers-sign')
  headers_opt["sign"] = Sha1(sign.substr(1)).toUpperCase();
  headers_opt = JSON.stringify(headers_opt);
  headers["dfsx-authorize"] = headers_opt;
  return headers;
}

module.exports = setHeaders


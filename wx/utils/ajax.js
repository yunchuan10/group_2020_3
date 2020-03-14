

const URL_BEFORE = 'https://newapi.dongfangshangxue.com/';  // 展示地址
// const URL_BEFORE = 'http://newapi.xkedu.top/';  // 测试地址
const setHeaders = require('./util')

function ajax({ method = 'GET', url = '', data = {}, ctp = 'application/json', success = null, fail = null, complete = null, loadShow=false} ){

  let header = setHeaders( url, data );
  header['content-type'] = ctp;
  header['xk-wx-version'] = '1.0.0';
  // console.log(header,5555)
  wx.request({
    method : method,
    url : URL_BEFORE + url,
    data,
    header,
    success (res) {
      success && success(res.data);
    },
    fail (res) {
      fail && fail(res);
      // wx.showToast({
      //   title: res.data.message + '' || 'error',
      // })
    },
    complete (res) {
      complete && complete(res);
      !loadShow && wx.hideLoading();
    }

  })
}

module.exports.ajax = ajax

// pages/androidPay/androidPay.js
const app = getApp();
const { ajax } = require('../../utils/ajax.js');

Page({

  data: {
    order_no: '',
    orderInfo: {}
  },

  onLoad: function (options) {
    this.setData({
      order_no: options.order_no,
    })
  },

  onShow: function () {
    // 获取订单详情
    this.getOrderDetail();
  },

  // 微信支付
  wxPayment: function(e){
    let orderstatus = e.currentTarget.dataset.orderstatus;
    // 0 是未支付状态
    if (orderstatus == '0'){
      ajax({
        url: 'wxpayxcx',
        method: 'post',
        data: {
          openid: wx.getStorageSync('openid'),
          trade_no: this.data.order_no,
        },
        success: data => {
          if (data.statusCode == '200') {
            let that  = this
            wx.requestPayment({
              timeStamp: data.result.timeStamp + '',
              nonceStr: data.result.nonceStr,
              package: data.result.package,
              signType: data.result.signType,
              paySign: data.result.paySign,
              success(res) {
                wx.redirectTo({
                  url: '../payInform/payInform?order_status=1&order_no=' + that.data.order_no,
                })
              },
              fail(res) {
                console.log(res,'支付失败');
              }
            })
          } else {
            // wx.showToast({
            //   title: data.message,
            //   icon: 'none',
            //   duration: 2000
            // })

            setTimeout(() => {
              wx.showToast({
                title: data.message,
                icon: "none",
              });
              setTimeout(() => {
                wx.hideToast();
              }, 2000)
            }, 0);
          }
        }
      })

    }else{
      // wx.showToast({
      //   title: '此订单已操作,请勿重复操作',
      //   icon: 'none',
      //   duration: 2000
      // })

      setTimeout(() => {
        wx.showToast({
          title: '此订单已操作,请勿重复操作',
          icon: "none",
        });
        setTimeout(() => {
          wx.hideToast();
        }, 2000)
      }, 0);
    }
  },

  // 查询优惠码
  getOrderDetail : function () {
    ajax({
      url: 'order_detail ',
      method: 'post',
      data: {
        uid: wx.getStorageSync('userId'),
        order_no: this.data.order_no,
      },
      success: data => {
        if (data.statusCode == '200') {
          this.setData({
            orderInfo: data.result,
          })
        } else {
          // wx.showToast({
          //   title: data.message,
          //   icon: 'none',
          //   duration: 1500
          // })

          setTimeout(() => {
            wx.showToast({
              title: data.message,
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
          
        }
      }
    })
  },

})
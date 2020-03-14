// pages/myOrderDetail/myOrderDetail.js
const util = require('../../utils/util.js')
const { ajax } = require('../../utils/ajax.js')//ajax 
var order_no='';
var order_id ='';
var order_status= '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      orderData:{},
      order_status:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求订单详情
    let that = this;
    order_no = options.order_no || '';
    order_status = options.order_status || '';
    that.orderDetail(order_no, order_status);
  },
  //请求订单详情
  orderDetail: function (order_no, order_status){
    //从缓存中获取
    var uid = wx.getStorageSync('userId') || '';
    ajax({
      method:"POST",
      url:"order_detail",
      data:{
        uid : uid,
        order_no : order_no
      },
      success:data =>{
        if (data.statusCode !== 200) {
          // wx.showToast({
          //   title: '网络异常,刷新重试!',
          //   duration: 2000
          // })
          setTimeout(() => {
            wx.showToast({
              title: '网络异常,刷新重试!',
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
          return;
        }
        console.log(data.result)
        this.setData({
          orderData : data.result,
          order_status: order_status
        })
      }
    })
  },
  //跳转到申请售后
  afterSale:function(e){
    let order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '../afterSale/afterSale?order_id=' + order_id + '&order_no=' + order_no + '&order_status=' + order_status,
    })
  },
  //查看学员告知书
  studentNotification:function(){
    wx.navigateTo({
      url: '../payInform/payInform?order_no=' + order_no + '&order_status=' + order_status,
    })
  },
  //取消订单
  cancleOrder: function (e) {
    var that = this;
    var cancelId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用取消订单方法
          that.cancelOrders(cancelId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //取消订单
  cancelOrders: function (cancelId) {
    var that = this;
    //向后台请求取消订单
    //从缓存中获取
    let uid = wx.getStorageSync('userId') || '';
    ajax({
      method: "POST",
      url: "wxCancelOrder",
      data: {
        uid: uid,
        orderId: cancelId
      },
      success: data => {
        if (data.statusCode !== 200) {//userId参数为空
          setTimeout(() => {
            wx.showToast({
              title: '网络异常,刷新重试',
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
          return;
        }
        //删除成功则改变改变状态
        var order_arr = orderData['newOrders'];
        for (var i = 0; i < order_arr.length; i++) {
          if (order_arr[i].id == cancelId) {
            order_arr[i].order_status = 2;
          }
        }
        that.setData({
          newOrders: order_arr
        })
      },
      fail: res => {
        setTimeout(() => {
          wx.showToast({
            title: '网络异常,刷新重试',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
        }, 0);
      },
    })
  },
  //立即支付按钮点击
  immediatePayment: function (e) {
    //获取URL中的参数 传递给下一个页面
    var order_no = e.currentTarget.dataset.orderNo;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "android") {
          //URL 参数待定
          wx.navigateTo({
            url: '../androidPay/androidPay?order_no=' + order_no,
          })
        } else if (res.platform == "ios") {
          //URL 参数待定 页面路径待定
          wx.navigateTo({
            url: '../iosCode/iosCode?order_no=' + order_no,
          })
        } else if (res.platform == "devtools") {
          console.log('pc');
        }
      }
    })
  },
})
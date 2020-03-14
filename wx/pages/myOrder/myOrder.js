// pages/myOrder/myOrder.js
const util = require('../../utils/util.js')
const { ajax } = require('../../utils/ajax.js')//ajax 请求
var orderData = [];//数据请求列表
Page({
  data: {
    hide: true,
    orderTitle:true,
    newOrders: [],
    loadMore : null,
    pages : 1,//默认第一页
  },
 
  //取消订单
  cancleOrder:function(e){
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
  cancelOrders: function (cancelId){
    var that = this;
    //向后台请求取消订单
    //从缓存中获取
    let uid = wx.getStorageSync('userId') || '';
      ajax({
        method:"POST",
        url:"wxCancelOrder",
        data:{
          uid: uid,
          orderId: cancelId
        },
        success:data=>{
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
          for(var i = 0; i < order_arr.length; i++){
            if( order_arr[i].id == cancelId){
              order_arr[i].order_status = 2 ;
            }
          }
          that.setData({
            newOrders : order_arr
          })
        },
        fail:res =>{
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
  //跳转到订单详情
  orderDetails:function(e){
    let order_no = e.currentTarget.dataset.order_no;
    let order_status = e.currentTarget.dataset.order_status;
    //跳转到订单详情
    wx.navigateTo({
      url: '../myOrderDetail/myOrderDetail?order_no=' + order_no + '&order_status=' + order_status,
    })
  },
  //立即支付按钮点击
  immediatePayment:function(e){
    //获取URL中的参数 传递给下一个页面
    var order_no = e.currentTarget.dataset.orderNo;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "android")  {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   var that = this;
    //   //数据请求列表-1
    // that.orderDataShow();
  },
  //数据请求列表-1
  orderDataShow:function(success){
      let that = this;
      //从缓存中获取
      var uid = wx.getStorageSync('userId') || '';
      //ajax 请求数据
      ajax({
        method:"POST",
        url:'myOrder',
        data: {
          uid: uid,
          page: this.data.pages,
          pageSize: 10
        },
        success: data => {
          if (data.statusCode !== 200) {//userID参数为空
            return;
          }
          var orderDatas = data.result || [];
          this.setData({//页码自动加一
            pages: this.data.pages + 1
          })
          if (this.data.loadMore) {
            if (orderDatas.length > 0) {
              //加载更多
              orderData['newOrders'] = orderData['newOrders'].concat(orderDatas);
            } else {
              this.setData({
                hide: true,
                orderTitle:false,
                loadMore : false
              })
              setTimeout(() => {
                wx.showToast({
                  title: '暂无更多订单！',
                  icon: "loading",
                });
                setTimeout(() => {
                  wx.hideToast();
                }, 2000)
              }, 0);
            }
          } else {
            if (this.data.loadMore == null) {
              //刷新
              orderData['newOrders'] = orderDatas;
            }
          }
          that.setData({
            newOrders: orderData['newOrders']
          });
        },
        fail: res => {
          setTimeout(() => {
            wx.showToast({
              title: '网络异常,刷新重试!',
              icon: "none",
            });
            setTimeout(() => {
              wx.hideToast();
            }, 2000)
          }, 0);
        }
      })
      wx.stopPullDownRefresh();//结束动画
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      pages: 1
    })
    //数据请求列表-1
    that.orderDataShow();
  
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '../my/my'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数 上拉加载采用的是 调用方法 下拉刷新采取的是配置app.json与当前页面的JSON
   */
  onReachBottom: function () {
    var that = this;
    that.setData({
      loadMore: true
    })
    //请求数据
    that.orderDataShow();
  },
})
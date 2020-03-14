// pages/leftSlide/leftSlide.js
const App = getApp();
const { ajax } = require('../../utils/ajax.js')//ajax 请求
var appointmentData = [];//数据请求列表
Page({
  data: {
    hide: true,
    appointmentTitle: true,
    newAppointment: [],
    loadMore: null,
    pages: 1,//默认第一页
  },
  touchS: function (e) {  // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchM: function (e) {  // touchmove
    let newAppointment = App.Touches.touchM(e, this.data.newAppointment, this.data.startX)
    newAppointment && this.setData({ newAppointment })
  },
  touchE: function (e) {  // touchend
    const width = 190  // 定义操作列表宽度
    let newAppointment = App.Touches.touchE(e, this.data.newAppointment, this.data.startX, width)
    newAppointment && this.setData({ newAppointment })
  },
  itemDelete: function(e){  
    let that = this;
    // //在此调用删除接口
    let appointment_id = e.currentTarget.dataset.id;
    //从缓存中获取
    let uid = wx.getStorageSync('userId') || '';
    //弹框提示删除与否
    wx.showModal({
      title: '温馨提示',
      content: '您确定要取消此预约吗？',
      cancelText:'我再想想',
      confirmText:'确定取消',
      success(res) {
        if (res.confirm) {
          ajax({
            method: "POST",
            url: 'openClassBooking',
            data: {
              "uid": uid,
              "id": appointment_id,
              "status": 0
            },
            success: data => {
              if (data.statusCode == 200) {//userID参数为空
                let newAppointment = App.Touches.deleteItem(e, that.data.newAppointment)
                newAppointment && that.setData({ newAppointment })
                setTimeout(() => {
                  wx.showToast({
                    title: '预约取消成功！',
                    icon: "none",
                  });
                  setTimeout(() => {
                    wx.hideToast();
                  }, 2000)
                }, 200);
              }
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
              }, 1000);
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //请求数据列表
  appointmentDataShow: function (success) {
    let that = this;
    //从缓存中获取
    var uid = wx.getStorageSync('userId') || '';
    //ajax 请求数据
    ajax({
      method: "POST",
      url: 'openClassBookList',
      data: {
        uid: uid,
        page: this.data.pages,
        pageSize: 6
      },
      success: data => {
        if (data.statusCode !== 200) {//userID参数为空
          return;
        }
        var orderDatas = data.result.list || [];
        this.setData({//页码自动加一
          pages: this.data.pages + 1
        })
        if (this.data.loadMore) {
          if (orderDatas.length > 0) {
            //加载更多
            appointmentData['newAppointment'] = appointmentData['newAppointment'].concat(orderDatas);
          } else {
            this.setData({
              hide: true,
              appointmentTitle: false,
              loadMore: false
            })
            setTimeout(() => {
              wx.showToast({
                title: '暂无更多预约！',
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
            appointmentData['newAppointment'] = orderDatas;
          }
        }
        that.setData({
          newAppointment:appointmentData['newAppointment']
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
  //跳转到预约详情页面
  appointmentDetail:function(e){
    let appointmentId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../openCourse/openCourse?courderId=' + appointmentId
    })
  },
  onShow: function () {
    // 页面显示
    var that = this;
    that.setData({
      pages: 1
    })
    //数据请求列表-1
    that.appointmentDataShow();
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
    that.appointmentDataShow();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})
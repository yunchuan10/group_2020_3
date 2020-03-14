// pages/myCampus/myCampus.js
const { ajax } = require('../../utils/ajax.js')//ajax 请求
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    school_campus:[],
    userInfo: {},
  },
  onShow:function(){
    //获取用户的经纬度
    this.getLocation();
  },
  getLocation:function(){
    var that = this;
    //获取当前用户经纬度
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(latitude,'ssss');
        let latitude = res.latitude+'';
        let longitude = res.longitude+'';
        that.getMessage(latitude, longitude)
      },
      fail(err){
        setTimeout(() => {
          wx.showToast({
            title: '获取位置失败!请打开GPS',
            icon: "none",
          });
          setTimeout(() => {
            wx.hideToast();
          }, 3000)
        }, 1000);
        let latitude =  '';
        let longitude =  '';
        that.getMessage(latitude , longitude)
      }
    })
  },
  //向后台请求数据
  getMessage:function(lat,longit){
    ajax({
      method: "POST",
      url: 'getCampus',
      data: {
        latitude: lat,
        longitude: longit,
      },
      success: data => {
        if (data.statusCode == 200) {//userID参数为空
          this.setData({
            school_campus : data.result
          }) 
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
        }, 0);
      }
    });

    if (app.globalData.userInfo){
      this.data.userInfo = app.globalData.userInfo;
      this.data.userInfo.userPhone = wx.getStorageSync('userPhone') || '';
      console.log(this.data.userInfo,'222');
      this.setData({
        userInfo: this.data.userInfo,
      })
    }
  },

  //点击跳转到对应的校区详情
  catchMyCampus:function(e){
    //获取相应的参数 通过URL传递给详情页用于数据请求
    let ID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../myCampusDetails/myCampusDetails?Id=' + ID
    })
  },

})
//logs.js
const util = require('../../utils/util.js')
const { ajax } = require('../../utils/ajax.js')//ajax 请求
var app = getApp()
Page({
  data: {
    logs: [],
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    propa: ()=>{

    }
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    //数据请求
    this.personMessage();
  },
  personMessage:function( s ){
    var that = this;
    //从缓存中获取 local存储 方法一  userInfo.userPhone.substring(0, 3) + '****' + userInfo.userPhone.substring(7) 手机号加密方式
    var result = {};
    if (app.globalData.userInfo!=null){
      var telePhone = wx.getStorageSync('userPhone').toString().replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3") || ''
      result.userPhone = telePhone;//获取电话号码
      result.avatarUrl = app.globalData.userInfo.avatarUrl || '';
      result.nickName = app.globalData.userInfo.nickName || '';
      result.userId = app.globalData.userInfo.userId || wx.getStorageSync('userId');
      that.setData({
        userInfo: result,
      })
    }
   
  }
})

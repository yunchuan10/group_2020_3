// pages/payInform/payInform.js
var order_nos= '';
var order_status='';
var paysucess = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telePhones: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    order_nos= options.order_no || '';
    order_status = options.order_status || ''
    paysucess = options.paysucess || ''
  },
  goMyOrderDetail:function(){
      wx.redirectTo({
        url: '../myOrder/myOrder?order_no=' + order_nos + '&order_status=' + order_status,
      })
    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取缓存中的手机号码
    let telePhones = wx.getStorageSync('userPhone').toString() || '';//获取电话号码
    this.setData({
      telePhones: telePhones.substr(0, 3) + '****' + telePhones.substr(7)  
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.reLaunch({
      url: '../myOrderDetail/myOrderDetail?order_no=' + order_nos + '&order_status=' + order_status
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log(order_nos, order_status);
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
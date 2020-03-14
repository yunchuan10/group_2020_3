
var cc = getApp().globalData.ccsdk;
const { ajax } = require('../../utils/ajax.js')

let live_opt = {};

Page({
  timer: null,
  data: {
    options: {}
  },
  onLoad: function (options) {
    cc.replay.quit();
    cc.live.quit();
    let userId = wx.getStorageSync('userId') + '' || '';
    let ccUser = wx.getStorageSync('ccUser') || {};
    if ( !userId || !ccUser.ccUserId ){ // 没有看过去首页
      wx.reLaunch({
        url: '/pages/index/index?pageId=mypublishlive'
      });
      return;
    }
    this.setData({
      options
    })
    
  },

  onShow(){
    cc.replay.quit();
    cc.live.quit();
    this.getCourseList(this.data.options);
  },

  // 获取列表
  getCourseList(opt) {
    wx.showLoading({
      title: '加载中'
    })
    ajax({
      url: 'openClassRecord',
      method: 'post',
      loadShow: true,
      data: {
        uid: wx.getStorageSync('userId') || '',
        open_class_id: opt.goodsId || "",
        id: opt.id,
      },
      success: data => {
        data.result = data.result || {};
        data.result.info = data.result.info || {};
        let chapter = data.result.info.chapter || [];

        live_opt = chapter.find(item => (item.id == opt.id)) || {};
        live_opt.time = data.result.time * 1;
        live_opt.end_time = live_opt.end_time + '' || '';
        live_opt.start_time = live_opt.start_time+''||'';
        
        live_opt.end_time = Date.parse(live_opt.end_time.replace(/-/g, '/').split('.')[0]);
        live_opt.newEnd = new Date(live_opt.end_time).getTime() / 1000;
        live_opt.start_time = Date.parse(live_opt.start_time.replace(/-/g, '/').split('.')[0]);
        live_opt.newStart = new Date(live_opt.start_time).getTime() / 1000;

        var record = (data.result.chapterInfo || {}).record || {};
        var recid = record.id || "";
        var cc_roomid = live_opt.cc_roomid||'';
        if (!cc_roomid){
          wx.showToast({
            title: '当前公开课已下架',
            icon: 'none'
          }, 2000);
          this.timer = setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index?pageId=mypublishlive'
            });
          }, 2000)

        }else if (live_opt.time > live_opt.newEnd ) {   // 去回放  live_opt.time > live_opt.newEnd || 
          wx.redirectTo({
            url: '../ccBack/ccBack?id=' + opt.id + '&roomid=' + cc_roomid + '&goodsId=' + opt.goodsId
          })
        }else{    // 去直播页
          wx.redirectTo({
            url: '../ccLive/ccLive?id=' + opt.id + '&roomid=' + cc_roomid + '&goodsId=' + opt.goodsId
          })
        }
      }

    })
  },

  onHide(){
    wx.hideLoading();
    clearTimeout(this.timer);
  }


 


})
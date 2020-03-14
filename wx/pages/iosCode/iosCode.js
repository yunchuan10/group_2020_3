
var QR = require("../../utils/qrcode.js");

Page({
  data:{
    canvasHidden:false,
    maskHidden:true,
    imagePath:'',
    placeholder: 'http://www.dongfangshangxue.com/orderpay/',
    // placeholder: 'http://www.xkedu.top/orderpay/', // 测试地址
    orderNo: '',  // 订单号
    userPhone:'',
  },

  onLoad:function(options){
    // console.log(options.order_no);
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    var initUrl = this.data.placeholder + options.order_no;
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
    this.setData({
      orderNo: options.order_no,
      userPhone: wx.getStorageSync('userPhone').toString().replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3"),
    })
  },

  //适配不同屏幕大小的canvas
  setCanvasSize:function(){
    var size={};
    try {
        var res = wx.getSystemInfoSync();
        var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败"+e);
      } 
    return size;
  },

  createQrCode:function(url,canvasId,cavW,cavH){
    wx.showLoading({
      title: '加载中'
    })
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url,canvasId,cavW,cavH);
    setTimeout(() => { this.canvasToTempImage();},1000);
  },

  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          // console.log(tempFilePath);
          that.setData({
              imagePath:tempFilePath,
             // canvasHidden:true
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
    // 隐藏加载中
    wx.hideLoading();
  },

  //点击图片进行预览，长按保存分享图片
  previewImg:function(e){
    console.log(this.data.imagePath);
    var img = this.data.imagePath;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img],  // 需要预览的图片http链接列表
    })
  },

})